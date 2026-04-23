import api from './api';

class PostService {
  async getAll(page = 1, limit = 20) {
    try {
      console.log(`📚 Cargando posts - página ${page}, límite ${limit}`);
      const response = await api.get(`/posts?page=${page}&limit=${limit}`);
      console.log('✅ Posts cargados:', response.data.data.posts.length);
      return response.data;
    } catch (error) {
      console.error('❌ Error cargando posts:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      console.log(`🔍 Cargando post ${id}`);
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error cargando post ${id}:`, error);
      throw error;
    }
  }

  async create(postData) {
    try {
      console.log('📝 Creando post:', postData.title);
      const response = await api.post('/posts', postData);
      console.log('✅ Post creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando post:', error);
      throw error;
    }
  }

  async update(id, postData) {
    try {
      console.log(`✏️ Actualizando post ${id}`);
      const response = await api.put(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando post ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      console.log(`🗑️ Eliminando post ${id}`);
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando post ${id}:`, error);
      throw error;
    }
  }

  async search(query, page = 1, limit = 20) {
    try {
      const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error buscando posts:', error);
      throw error;
    }
  }

  async getByUser(userId, page = 1, limit = 20) {
    try {
      console.log(`👤 Cargando posts del usuario ${userId}`);
      const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error cargando posts del usuario:`, error);
      throw error;
    }
  }
}

export default new PostService();