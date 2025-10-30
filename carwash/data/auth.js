import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/auth/login/', {
      username,
      password,
    });
    const data = response.data;

    if (data.access) {
      await AsyncStorage.setItem('access_token', data.access);
      await AsyncStorage.setItem('refresh_token', data.refresh);
    }

    return data;
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
