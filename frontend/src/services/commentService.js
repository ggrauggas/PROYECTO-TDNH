import api from './api';

class CommentService {
  async getByPost(postId) {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  }

  async create(commentData) {
    const response = await api.post('/comments', commentData);
    return response.data;
  }

  async update(id, content) {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  }

  async delete(id) {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
}

export default new CommentService();