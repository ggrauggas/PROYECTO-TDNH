const { pool } = require('../db/config/database');

class PostModel {
  // Crear una nueva publicación
  async create(postData) {
    const { user_id, title, content, category, tags } = postData;
    
    const query = `
      INSERT INTO posts (user_id, title, content, category, tags)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [user_id, title, content, category, tags];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener todas las publicaciones con información de usuario y conteos
  async findAll(limit = 20, offset = 0) {
    const query = `
      SELECT
        p.*,
        u.username,
        u.full_name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT l.id) as like_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes l ON p.id = l.post_id
      GROUP BY p.id, u.username, u.full_name, u.avatar_url, u.role
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  // Obtener una publicación por ID
  async findById(id) {
    const query = `
      SELECT
        p.*,
        u.username,
        u.full_name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT l.id) as like_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = $1
      GROUP BY p.id, u.username, u.full_name, u.avatar_url, u.role
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Actualizar una publicación
  async update(id, user_id, postData) {
    const { title, content, category, tags } = postData;
    
    const query = `
      UPDATE posts 
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          category = COALESCE($3, category),
          tags = COALESCE($4, tags),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5 AND user_id = $6
      RETURNING *
    `;
    
    const values = [title, content, category, tags, id, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Eliminar una publicación
  async delete(id, user_id) {
    const query = 'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [id, user_id]);
    return result.rows[0];
  }

  // Incrementar contador de vistas
  async incrementViewCount(id) {
    const query = 'UPDATE posts SET view_count = view_count + 1 WHERE id = $1';
    await pool.query(query, [id]);
  }

  // Obtener publicaciones por usuario
  async findByUserId(user_id, limit = 20, offset = 0) {
    const query = `
      SELECT 
        p.*,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [user_id, limit, offset]);
    return result.rows;
  }
}

module.exports = new PostModel();