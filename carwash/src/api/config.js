// app/api/config.js
export const API_BASE = 'http://20.205.137.59:8000';
export const AUTH = {
  REGISTER: `${API_BASE}/api/auth/register/`,
  LOGIN: `${API_BASE}/api/auth/login/`,
  REFRESH: `${API_BASE}/api/auth/refresh/`,
  LOGOUT: `${API_BASE}/api/auth/logout/`,
};
