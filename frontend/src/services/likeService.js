import api from './api';

class LikeService {
  async likePost(postId) {
    const response = await api.post(`/likes/post/${postId}`);
    return response.data;
  }

  async unlikePost(postId) {
    const response = await api.delete(`/likes/post/${postId}`);
    return response.data;
  }

  async likeComment(commentId) {
    const response = await api.post(`/likes/comment/${commentId}`);
    return response.data;
  }

  async unlikeComment(commentId) {
    const response = await api.delete(`/likes/comment/${commentId}`);
    return response.data;
  }
}

export default new LikeService();