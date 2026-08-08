import axios from 'axios';


const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const storedAuth = localStorage.getItem('wfi-auth');
  if (storedAuth) {
    try {
      const parsed = JSON.parse(storedAuth);
      if (parsed.tokens?.access_token) {
        config.headers.Authorization = `Bearer ${parsed.tokens.access_token}`;
      }
    } catch {
      // Ignore
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Optionally handle token refresh here
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
