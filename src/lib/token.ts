import cookie from 'js-cookie';
import api, { User } from './axios';

export const isValidSanctumToken = (token?: string | null): boolean => {
  if (!token || token === 'undefined' || token === 'null') return false;

  return /^\d+\|[A-Za-z0-9]+$/.test(token);
};

export async function validateToken(): Promise<{ isValid: boolean; user: User | null }> {
  try {
    const token = cookie.get('token');

    if (!isValidSanctumToken(token)) {
      localStorage.removeItem('token');
      cookie.remove('token', { path: '/' });
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