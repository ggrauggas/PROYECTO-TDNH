const postModel = require('../models/postModel');
const likeModel = require('../models/likeModel');

class PostController {
  // Crear una nueva publicación
  async create(req, res) {
    try {
      const { title, content, category, tags } = req.body;
      const user_id = req.user.id;

      const newPost = await postModel.create({
        user_id,
        title,
        content,
        category,
        tags
      });

      res.status(201).json({
        status: 'success',
        message: 'Publicación creada exitosamente',
        data: { post: newPost }
      });

    } catch (error) {
      console.error('Error al crear publicación:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al crear la publicación'
      });
    }
  }

  // Obtener todas las publicaciones
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const posts = await postModel.findAll(limit, offset);

      // Si el usuario está autenticado, verificar sus likes
      if (req.user) {
        for (let post of posts) {
          post.user_has_liked = await likeModel.hasLikedPost(req.user.id, post.id);
        }
      }

      res.json({
        status: 'success',
        data: {
          posts,
          pagination: {
            page,
            limit,
            hasMore: posts.length === limit
          }
        }
      });

    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener las publicaciones'
      });
    }
  }

  // Obtener una publicación por ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const post = await postModel.findById(id);

      if (!post) {
        return res.status(404).json({
          status: 'error',
          message: 'Publicación no encontrada'
        });
      }

      // Solo incrementar vistas y cargar likes si no está eliminada
      if (!post.is_deleted) {
        await postModel.incrementViewCount(id);
        if (req.user) {
          post.user_has_liked = await likeModel.hasLikedPost(req.user.id, id);
        }
      }

      res.json({
        status: 'success',
        data: { post }
      });

    } catch (error) {
      console.error('Error al obtener publicación:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener la publicación'
      });
    }
  }

  // Actualizar una publicación
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, content, category, tags } = req.body;
      const user_id = req.user.id;

      const updatedPost = await postModel.update(id, user_id, {
        title,
        content,
        category,
        tags
      });

      if (!updatedPost) {
        return res.status(404).json({
          status: 'error',
          message: 'Publicación no encontrada o no tienes permiso para editarla'
        });
      }

      res.json({
        status: 'success',
        message: 'Publicación actualizada exitosamente',
        data: { post: updatedPost }
      });

    } catch (error) {
      console.error('Error al actualizar publicación:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al actualizar la publicación'
      });
    }
  }

  // Soft delete de una publicación (propietario o admin)
  async delete(req, res) {
    try {
      const { id } = req.params;
      const isAdmin = req.user.role === 'admin';

      const deletedPost = isAdmin
        ? await postModel.softDelete(id, null, 'admin')
        : await postModel.softDelete(id, req.user.id, 'user');

      if (!deletedPost) {
        return res.status(404).json({
          status: 'error',
          message: 'Publicación no encontrada o no tienes permiso para eliminarla'
        });
      }

      res.json({
        status: 'success',
        message: 'Publicación eliminada exitosamente'
      });

    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al eliminar la publicación'
      });
    }
  }

  // Obtener publicaciones por usuario
  async getByUser(req, res) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

      const posts = await postModel.findByUserId(userId, limit, offset);

      res.json({
        status: 'success',
        data: {
          posts,
          pagination: {
            page,
            limit,
            hasMore: posts.length === limit
          }
        }
      });

    } catch (error) {
      console.error('Error al obtener publicaciones del usuario:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener las publicaciones'
      });
    }
  }
}

module.exports = new PostController();