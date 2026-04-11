import api from './api';

class UserService {
  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(userData) {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  }

  async getUserPosts(userId, page = 1, limit = 20) {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getStats(userId) {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  }

  async getPublicProfile(id) {
    const response = await api.get(`/users/${id}/profile`);
    return response.data;
  }

  async adminGetAll() {
    const response = await api.get('/admin/users');
    return response.data;
  }

  async adminUpdate(id, data) {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  }

  async adminDelete(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  }
}

export default new UserService();