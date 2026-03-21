import api from './api';

class AuthService {
  async register(userData) {
    try {
      console.log('📝 Intentando registrar usuario:', userData.email);
      
      // Asegurarse de que los datos están en el formato correcto
      const dataToSend = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.full_name || '',
        diabetes_type: userData.diabetes_type || '',
        diagnosis_date: userData.diagnosis_date || null,
        bio: userData.bio || ''
      };
      
      const response = await api.post('/auth/register', dataToSend);
      console.log('✅ Registro exitoso:', response.data);
      
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en registro:', error.response?.data || error.message);
      throw error;
    }
  }

  async login(credentials) {
    try {
      console.log('🔑 Intentando login:', credentials.email);
      
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      console.log('✅ Login exitoso:', response.data);
      
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error.response?.data || error.message);
      throw error;
    }
  }

  logout() {
    console.log('🚪 Cerrando sesión');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();