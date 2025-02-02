import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

export const getAuthToken = async () => {
  // return await SecureStore.getItemAsync('auth_token');
  const token = await AsyncStorage.getItem('auth_token');
  return token ?? null;
};

export const getAuthUser = async () => {
  const user = await AsyncStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

export const signin = async (credentials) => {
  try {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const signup = async (credentials) => {
  try {
    const response = await apiClient.post('/api/auth/register', credentials);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response?.data || error.message);
    throw error;
  }
};

export const signout = async () => {
  await Promise.all([
    // SecureStore.deleteItemAsync('auth_token'),
    AsyncStorage.removeItem('auth_token'),
    AsyncStorage.removeItem('auth_user'),
  ]);
};
