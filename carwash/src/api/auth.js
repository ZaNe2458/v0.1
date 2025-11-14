import api from './api';

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
