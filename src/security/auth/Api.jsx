import axios from 'axios';
import { useAuth } from '@/security/auth/AuthContext';
import config from '@/config/baseUrl'; // Importez le fichier de configuration


const api = axios.create({
  baseURL: config.apiBaseUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Vous pouvez aussi récupérer depuis le contexte
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si le code de réponse est 403 ou 401, essayez de rafraîchir le token
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; // Empêche les boucles infinies

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.error('[Axios Interceptor] No refresh token available.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirection si pas de refreshToken
        return Promise.reject(error);
      }

      try {
        console.log('[Axios Interceptor] Refreshing access token...');
        const { data } = await api.post('/auth/refresh-token', { refreshToken });

        // Mettez à jour l'accessToken
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api.request(originalRequest); // Réessayez la requête originale
      } catch (refreshError) {
        console.error('[Axios Interceptor] Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
