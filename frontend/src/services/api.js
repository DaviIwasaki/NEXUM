import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // FastAPI
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de request
 * Anexa o token JWT se existir
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexum_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor de response
 * Futuro: tratar 401 globalmente
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexum_token');
    }
    return Promise.reject(error);
  }
);

export default api;
