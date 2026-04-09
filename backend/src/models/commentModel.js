const { pool } = require('../db/config/database');

class CommentModel {
  // Crear un nuevo comentario
  async create(commentData) {
    const { post_id, user_id, parent_comment_id, content } = commentData;
    
    const query = `
      INSERT INTO comments (post_id, user_id, parent_comment_id, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [post_id, user_id, parent_comment_id || null, content];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Obtener comentarios de una publicación
  async findByPostId(post_id) {
    const query = `
      WITH RECURSIVE comment_tree AS (
        -- Comentarios raíz (sin padre)
        SELECT
          c.*,
          u.username,
          u.full_name as author_name,
          u.avatar_url as author_avatar,
          u.role as author_role,
          0 as level,
          c.id as path
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = $1 AND c.parent_comment_id IS NULL

        UNION ALL

        -- Respuestas a comentarios
        SELECT
          c.*,
          u.username,
          u.full_name as author_name,
          u.avatar_url as author_avatar,
          u.role as author_role,
          ct.level + 1,
          ct.path
        FROM comments c
        JOIN users u ON c.user_id = u.id
        INNER JOIN comment_tree ct ON c.parent_comment_id = ct.id
      )
      SELECT * FROM comment_tree
      ORDER BY path, created_at
    `;
    
    const result = await pool.query(query, [post_id]);
    return result.rows;
  }

  // Obtener un comentario por ID
  async findById(id) {
    const query = `
      SELECT
        c.*,
        u.username,
        u.full_name as author_name,
        u.avatar_url as author_avatar,
        u.role as author_role
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Actualizar un comentario
  async update(id, user_id, content) {
    const query = `
      UPDATE comments 
      SET content = $1, is_edited = true, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
    
    const result = await pool.query(query, [content, id, user_id]);
    return result.rows[0];
  }

  // Eliminar un comentario
  async delete(id, user_id) {
    const query = 'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [id, user_id]);
    return result.rows[0];
  }

  // Verificar si el usuario es dueño del comentario
  async isOwner(id, user_id) {
    const query = 'SELECT id FROM comments WHERE id = $1 AND user_id = $2';
    const result = await pool.query(query, [id, user_id]);
    return result.rows.length > 0;
  }
}

module.exports = new CommentModel();