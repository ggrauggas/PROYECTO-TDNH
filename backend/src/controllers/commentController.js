const commentModel = require('../models/commentModel');
const likeModel = require('../models/likeModel');

class CommentController {
  // Crear un comentario
  async create(req, res) {
    try {
      const { post_id, content, parent_comment_id } = req.body;
      const user_id = req.user.id;

      const newComment = await commentModel.create({
        post_id,
        user_id,
        parent_comment_id,
        content
      });

      // Obtener el comentario con información del autor
      const commentWithAuthor = await commentModel.findById(newComment.id);

      res.status(201).json({
        status: 'success',
        message: 'Comentario agregado exitosamente',
        data: { comment: commentWithAuthor }
      });

    } catch (error) {
      console.error('Error al crear comentario:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al agregar el comentario'
      });
    }
  }

  // Obtener comentarios de una publicación
  async getByPost(req, res) {
    try {
      const { postId } = req.params;

      const comments = await commentModel.findByPostId(postId);

      // Si el usuario está autenticado, verificar sus likes en comentarios
      if (req.user) {
        for (let comment of comments) {
          comment.user_has_liked = await likeModel.hasLikedComment(req.user.id, comment.id);
        }
      }

      res.json({
        status: 'success',
        data: { comments }
      });

    } catch (error) {
      console.error('Error al obtener comentarios:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener los comentarios'
      });
    }
  }

  // Actualizar un comentario
  async update(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user_id = req.user.id;

      const updatedComment = await commentModel.update(id, user_id, content);

      if (!updatedComment) {
        return res.status(404).json({
          status: 'error',
          message: 'Comentario no encontrado o no tienes permiso para editarlo'
        });
      }

      res.json({
        status: 'success',
        message: 'Comentario actualizado exitosamente',
        data: { comment: updatedComment }
      });

    } catch (error) {
      console.error('Error al actualizar comentario:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al actualizar el comentario'
      });
    }
  }

  // Eliminar un comentario
  async delete(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const deletedComment = await commentModel.delete(id, user_id);

      if (!deletedComment) {
        return res.status(404).json({
          status: 'error',
          message: 'Comentario no encontrado o no tienes permiso para eliminarlo'
        });
      }

      res.json({
        status: 'success',
        message: 'Comentario eliminado exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al eliminar el comentario'
      });
    }
  }
}

module.exports = new CommentController();