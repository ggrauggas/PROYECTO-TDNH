const { pool } = require('../db/config/database');
const bcrypt = require('bcrypt');

class UserModel {
  // Crear un nuevo usuario
  async create(userData) {
    const { username, email, password, full_name, diabetes_type, diagnosis_date, bio, glucose_enabled } = userData;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (username, email, password, full_name, diabetes_type, diagnosis_date, bio, glucose_enabled)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, email, full_name, role, glucose_enabled, created_at
    `;

    const values = [username, email, hashedPassword, full_name, diabetes_type, diagnosis_date, bio, glucose_enabled ?? false];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuario por email
  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Buscar usuario por username
  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  // Buscar usuario por ID
  async findById(id) {
    const query = `
      SELECT id, username, email, full_name, diabetes_type, diagnosis_date,
             bio, avatar_url, role, glucose_enabled, created_at
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Actualizar último login
  async updateLastLogin(id) {
    const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Verificar contraseña
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Obtener todos los usuarios (para admin) con conteos
  async findAll(limit = 500, offset = 0) {
    const query = `
      SELECT u.id, u.username, u.email, u.full_name, u.diabetes_type,
             u.role, u.is_active, u.created_at, u.bio,
             COUNT(DISTINCT p.id)::int AS post_count,
             COUNT(DISTINCT c.id)::int AS comment_count
      FROM users u
      LEFT JOIN posts p ON p.user_id = u.id
      LEFT JOIN comments c ON c.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  // Actualizar usuario desde panel admin
  async adminUpdate(id, data) {
    const { full_name, username, email, diabetes_type, bio, role, is_active, hashedPassword } = data;
    const query = `
      UPDATE users
      SET full_name   = COALESCE($1, full_name),
          username    = COALESCE($2, username),
          email       = COALESCE($3, email),
          diabetes_type = COALESCE($4, diabetes_type),
          bio         = COALESCE($5, bio),
          role        = COALESCE($6, role),
          is_active   = COALESCE($7, is_active),
          password    = COALESCE($8, password),
          updated_at  = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING id, username, email, full_name, diabetes_type, bio, role, is_active, created_at
    `;
    const result = await pool.query(query, [full_name, username, email, diabetes_type, bio, role, is_active, hashedPassword ?? null, id]);
    return result.rows[0];
  }

  // Eliminar usuario (admin)
  async adminDelete(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }

  // Perfil público de un usuario (para ver el perfil de otro)
  async getPublicProfile(id) {
    const query = `
      SELECT u.id, u.username, u.full_name, u.avatar_url, u.diabetes_type,
             u.bio, u.created_at,
             COUNT(DISTINCT p.id)::int AS post_count,
             COUNT(DISTINCT c.id)::int AS comment_count
      FROM users u
      LEFT JOIN posts p ON p.user_id = u.id
      LEFT JOIN comments c ON c.user_id = u.id
      WHERE u.id = $1
      GROUP BY u.id
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Obtener estadísticas de un usuario
  async getStats(id) {
    const query = `
      SELECT
        (SELECT COUNT(*) FROM posts WHERE user_id = $1) AS posts,
        (SELECT COUNT(*) FROM comments WHERE user_id = $1) AS comments,
        (SELECT COUNT(*) FROM likes l
         JOIN posts p ON l.post_id = p.id
         WHERE p.user_id = $1) AS likes_received
    `;
    const result = await pool.query(query, [id]);
    return {
      posts: parseInt(result.rows[0].posts),
      comments: parseInt(result.rows[0].comments),
      likesReceived: parseInt(result.rows[0].likes_received)
    };
  }

  // Actualizar perfil de usuario
  async update(id, userData) {
    const { full_name, diabetes_type, diagnosis_date, bio, avatar_url, glucose_enabled, hashedPassword } = userData;

    const query = `
      UPDATE users
      SET full_name = COALESCE($1, full_name),
          diabetes_type = COALESCE($2, diabetes_type),
          diagnosis_date = COALESCE($3, diagnosis_date),
          bio = COALESCE($4, bio),
          avatar_url = COALESCE($5, avatar_url),
          glucose_enabled = COALESCE($6, glucose_enabled),
          password = COALESCE($7, password),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING id, username, email, full_name, diabetes_type, diagnosis_date, bio, avatar_url, glucose_enabled
    `;

    const values = [full_name, diabetes_type, diagnosis_date, bio, avatar_url, glucose_enabled ?? null, hashedPassword ?? null, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = new UserModel();