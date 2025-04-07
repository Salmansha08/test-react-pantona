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
    if (!config.headers.Authorization) {
      const cookieToken = cookie.get('token');
      if (cookieToken && cookieToken !== 'undefined' && cookieToken !== 'null') {
        config.headers.Authorization = `Bearer ${cookieToken}`;
        return config;
      }

      try {
        const localToken = localStorage.getItem('token');
        if (localToken && localToken !== 'undefined' && localToken !== 'null') {
          config.headers.Authorization = `Bearer ${localToken}`;
        }
      } catch (error) {
        console.error('Error accessing localStorage token:', error);
      }
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

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const fetcher = async <T = any>(url: string): Promise<T> => {
  try {
    const response = await api.get<T>(url);
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error("An error occurred while fetching the data:", error);
    throw new Error(apiError.response?.data?.message || "An error occurred");
  }
};

export function logout() {
  localStorage.removeItem('token');
  cookie.remove('token', { path: '/' });
  window.location.href = '/auth/login';
}

export default api;