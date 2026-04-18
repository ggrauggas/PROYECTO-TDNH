const likeModel = require('../models/likeModel');

class LikeController {
  // Dar like a una publicación
  async likePost(req, res) {
    try {
      const { postId } = req.params;
      const user_id = req.user.id;

      const like = await likeModel.likePost(user_id, postId);

      if (!like) {
        return res.status(400).json({
          status: 'error',
          message: 'Ya has dado like a esta publicación'
        });
      }

      const likeCount = await likeModel.getPostLikeCount(postId);

      res.json({
        status: 'success',
        message: 'Like agregado',
        data: {
          like_count: likeCount,
          user_has_liked: true
        }
      });

    } catch (error) {
      console.error('Error al dar like:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al procesar el like'
      });
    }
  }

  // Quitar like de una publicación
  async unlikePost(req, res) {
    try {
      const { postId } = req.params;
      const user_id = req.user.id;

      const unlike = await likeModel.unlikePost(user_id, postId);

      if (!unlike) {
        return res.status(400).json({
          status: 'error',
          message: 'No habías dado like a esta publicación'
        });
      }

      const likeCount = await likeModel.getPostLikeCount(postId);

      res.json({
        status: 'success',
        message: 'Like eliminado',
        data: {
          like_count: likeCount,
          user_has_liked: false
        }
      });

    } catch (error) {
      console.error('Error al quitar like:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al procesar el like'
      });
    }
  }

  // Dar like a un comentario
  async likeComment(req, res) {
    try {
      const { commentId } = req.params;
      const user_id = req.user.id;

      const like = await likeModel.likeComment(user_id, commentId);

      if (!like) {
        return res.status(400).json({
          status: 'error',
          message: 'Ya has dado like a este comentario'
        });
      }

      const likeCount = await likeModel.getCommentLikeCount(commentId);

      res.json({
        status: 'success',
        message: 'Like agregado',
        data: {
          like_count: likeCount,
          user_has_liked: true
        }
      });

    } catch (error) {
      console.error('Error al dar like:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al procesar el like'
      });
    }
  }

  // Obtener usuarios que dieron like a una publicación
  async getPostLikers(req, res) {
    try {
      const { postId } = req.params;
      const likers = await likeModel.getPostLikers(postId);
      res.json({ status: 'success', data: { likers } });
    } catch (error) {
      console.error('Error obteniendo likers:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener los likes' });
    }
  }

  // Quitar like de un comentario
  async unlikeComment(req, res) {
    try {
      const { commentId } = req.params;
      const user_id = req.user.id;

      const unlike = await likeModel.unlikeComment(user_id, commentId);

      if (!unlike) {
        return res.status(400).json({
          status: 'error',
          message: 'No habías dado like a este comentario'
        });
      }

      const likeCount = await likeModel.getCommentLikeCount(commentId);

      res.json({
        status: 'success',
        message: 'Like eliminado',
        data: {
          like_count: likeCount,
          user_has_liked: false
        }
      });

    } catch (error) {
      console.error('Error al quitar like:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al procesar el like'
      });
    }
  }
}

module.exports = new LikeController();