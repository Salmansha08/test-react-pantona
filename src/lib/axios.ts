import axios from "axios";
import cookie from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = cookie.get('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 419)) {
      localStorage.removeItem('token');
      cookie.remove('token', { path: '/' });

      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/login')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export async function validateToken(): Promise<{ isValid: boolean; user: User | null }> {
  try {
    const token = cookie.get('token');

    if (!token || token === 'undefined' || token === 'null') {
      return { isValid: false, user: null };
    }

    const response = await api.get('/api/auth/me');

    if (response.status === 200 && response.data?.data) {
      return {
        isValid: true,
        user: response.data.data
      };
    }

    return { isValid: false, user: null };
  } catch (error) {
    console.error('Token validation error:', error);
    localStorage.removeItem('token');
    cookie.remove('token', { path: '/' });
    return { isValid: false, user: null };
  }
}

export function logout() {
  localStorage.removeItem('token');
  cookie.remove('token', { path: '/' });
  window.location.href = '/auth/login';
}

export default api;