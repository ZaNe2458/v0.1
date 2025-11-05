// src/config/constants.js
// ----------------------------
// Төвлөрсөн тохиргоо / тогтмол утгууд
// ----------------------------

export const BASE_URL = 'http://20.205.137.59:8000';

// Local storage (AsyncStorage) дээр хадгалагддаг түлхүүрүүд
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  REMEMBER_ME: 'remember_me',
  USER_PROFILE: 'profile_cache',
};

// App theme буюу өнгөний палитр (шаардлагатай бол)
export const COLORS = {
  primary: '#2563EB',
  secondary: '#3B82F6',
  danger: '#EF4444',
  success: '#10B981',
  text: '#0F172A',
  gray: '#64748B',
  bg: '#F1F5F9',
  white: '#FFFFFF',
};

// API path-уудыг нэг газар төвлөрүүлэх (илүү тодорхой болгоно)
export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/auth/login/',
    REGISTER: '/api/auth/register/',
    LOGOUT: '/api/auth/logout/',
    ME: '/api/auth/me/',
    REFRESH: '/api/auth/refresh/',
    CHANGE_PASSWORD: '/api/auth/change-password/',
  },
  COMPANIES: {
    LIST: '/api/companies/',
    DETAIL: (id) => `/api/companies/${id}/`,
  },
  SERVICES: {
    LIST: '/api/services/', // ?company=<id> дэмжинэ
    DETAIL: (id) => `/api/services/${id}/`,
  },
  BOOKINGS: {
    LIST: '/api/bookings/',
    DETAIL: (id) => `/api/bookings/${id}/`,
  },
};

// App-д түгээмэл ашиглагдах текстүүд / нэршлүүд
export const APP_INFO = {
  NAME: 'Ankhaa Car Wash',
  VERSION: 'v0.1',
};
