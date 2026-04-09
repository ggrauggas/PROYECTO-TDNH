const { pool } = require('../db/config/database');
const bcrypt = require('bcrypt');

class UserModel {
  // Crear un nuevo usuario
  async create(userData) {
    const { username, email, password, full_name, diabetes_type, diagnosis_date, bio } = userData;
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, email, password, full_name, diabetes_type, diagnosis_date, bio)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, email, full_name, role, created_at
    `;
    
    const values = [username, email, hashedPassword, full_name, diabetes_type, diagnosis_date, bio];
    
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
             bio, avatar_url, role, created_at
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

  // Obtener todos los usuarios (para admin)
  async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT id, username, email, full_name, role, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
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
    const { full_name, diabetes_type, diagnosis_date, bio, avatar_url } = userData;
    
    const query = `
      UPDATE users 
      SET full_name = COALESCE($1, full_name),
          diabetes_type = COALESCE($2, diabetes_type),
          diagnosis_date = COALESCE($3, diagnosis_date),
          bio = COALESCE($4, bio),
          avatar_url = COALESCE($5, avatar_url),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, username, email, full_name, diabetes_type, diagnosis_date, bio, avatar_url
    `;
    
    const values = [full_name, diabetes_type, diagnosis_date, bio, avatar_url, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = new UserModel();