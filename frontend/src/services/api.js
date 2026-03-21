import axios from 'axios';

// IMPORTANTE: Usar localhost DIRECTAMENTE - esto es lo que funciona
const API_URL = 'http://localhost:3000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
});

// Interceptor para logs de depuración
api.interceptors.request.use(
  config => {
    console.log(`📡 Enviando petición a: ${config.baseURL}${config.url}`);
    console.log('   Método:', config.method);
    if (config.data) console.log('   Datos:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('   Token incluido');
    }
    return config;
  },
  error => {
    console.error('❌ Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
api.interceptors.response.use(
  response => {
    console.log(`✅ Respuesta de ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('❌ Error de respuesta:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        console.log('🔒 Sesión expirada, redirigiendo a login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('❌ No hubo respuesta del servidor:', error.request);
      alert('Error de conexión con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3000');
    } else {
      // Error al configurar la petición
      console.error('❌ Error al configurar petición:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;