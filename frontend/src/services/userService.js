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
}

export default new UserService();