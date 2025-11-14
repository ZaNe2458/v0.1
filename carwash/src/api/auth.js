import api from './api';
import { get as clientGet, patch as clientPatch, post as clientPost } from './client';
import { API_PATHS } from '../config/constants';

export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login/', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.log('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  } catch (error) {
    console.log('Register error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchProfile = async () => {
  const { data } = await clientGet(API_PATHS.AUTH.ME);
  return data?.data ?? data;
};

export const updateProfile = async (payload) => {
  const { data } = await clientPatch(API_PATHS.AUTH.ME, payload);
  return data?.data ?? data;
};

export const changePassword = async (payload) => {
  const { data } = await clientPost(API_PATHS.AUTH.CHANGE_PASSWORD, payload);
  return data;
};

export const logoutSession = async (refresh) => {
  try {
    await clientPost(API_PATHS.AUTH.LOGOUT, { refresh });
  } catch (error) {
    if (error?.status === 401) return;
    throw error;
  }
};
