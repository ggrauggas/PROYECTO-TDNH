const { pool } = require('../db/config/database');

class LikeModel {
  // Dar like a una publicación
  async likePost(user_id, post_id) {
    const query = `
      INSERT INTO likes (user_id, post_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, post_id) DO NOTHING
      RETURNING *
    `;
    
    const result = await pool.query(query, [user_id, post_id]);
    return result.rows[0];
  }

  // Quitar like de una publicación
  async unlikePost(user_id, post_id) {
    const query = 'DELETE FROM likes WHERE user_id = $1 AND post_id = $2 RETURNING id';
    const result = await pool.query(query, [user_id, post_id]);
    return result.rows[0];
  }

  // Dar like a un comentario
  async likeComment(user_id, comment_id) {
    const query = `
      INSERT INTO likes (user_id, comment_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, comment_id) DO NOTHING
      RETURNING *
    `;
    
    const result = await pool.query(query, [user_id, comment_id]);
    return result.rows[0];
  }

  // Quitar like de un comentario
  async unlikeComment(user_id, comment_id) {
    const query = 'DELETE FROM likes WHERE user_id = $1 AND comment_id = $2 RETURNING id';
    const result = await pool.query(query, [user_id, comment_id]);
    return result.rows[0];
  }

  // Verificar si el usuario dio like a una publicación
  async hasLikedPost(user_id, post_id) {
    const query = 'SELECT id FROM likes WHERE user_id = $1 AND post_id = $2';
    const result = await pool.query(query, [user_id, post_id]);
    return result.rows.length > 0;
  }

  // Verificar si el usuario dio like a un comentario
  async hasLikedComment(user_id, comment_id) {
    const query = 'SELECT id FROM likes WHERE user_id = $1 AND comment_id = $2';
    const result = await pool.query(query, [user_id, comment_id]);
    return result.rows.length > 0;
  }

  // Obtener conteo de likes de una publicación
  async getPostLikeCount(post_id) {
    const query = 'SELECT COUNT(*) as count FROM likes WHERE post_id = $1';
    const result = await pool.query(query, [post_id]);
    return parseInt(result.rows[0].count);
  }

  // Obtener conteo de likes de un comentario
  async getCommentLikeCount(comment_id) {
    const query = 'SELECT COUNT(*) as count FROM likes WHERE comment_id = $1';
    const result = await pool.query(query, [comment_id]);
    return parseInt(result.rows[0].count);
  }

  // Obtener usuarios que han dado like a una publicación
  async getPostLikers(post_id) {
    const query = `
      SELECT u.id, u.username, u.full_name, u.avatar_url
      FROM likes l
      JOIN users u ON u.id = l.user_id
      WHERE l.post_id = $1
      ORDER BY l.created_at DESC
    `;
    const result = await pool.query(query, [post_id]);
    return result.rows;
  }
}

module.exports = new LikeModel();