import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? (process.env.VUE_APP_API_URL || 'http://localhost:3000/api')
  : '/api';
const isDev = process.env.NODE_ENV !== 'production';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

api.interceptors.request.use(
  config => {
    if (isDev) {
      console.log(`[api] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      if (isDev) {
        console.error('[api] error', error.response.status, error.response.data);
      }
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request && isDev) {
      console.error('[api] sin respuesta del servidor', error.request);
    }
    return Promise.reject(error);
  }
);

export default api;
