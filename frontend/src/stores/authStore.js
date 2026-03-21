import { reactive } from 'vue';
import authService from '../services/authService';

const authStore = reactive({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),

  setUser(user) {
    console.log('👤 Usuario actualizado:', user);
    this.user = user;
    this.isAuthenticated = !!user;
  },

  logout() {
    console.log('👋 Cerrando sesión');
    authService.logout();
    this.user = null;
    this.isAuthenticated = false;
  }
});

export default authStore;