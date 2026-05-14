import api from './apiClient';

export const authService = {
  register: (email, password) =>
    api.post('/auth/register', { email, password }, false),

  login: (email, password) =>
    api.post('/auth/login', { email, password }, false),

  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }, false),

  verifyEmail: (email) =>
    api.get(`/auth/verify-email/${encodeURIComponent(email)}`),
};
