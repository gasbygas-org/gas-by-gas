import Constants from 'expo-constants';
import { AsyncStorage } from 'react-native';

const SERVER_URL = Constants.expoConfig.extra.serverUrl;

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return null;
  }
};

export const setAuthToken = async (credentials) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem('authToken', data.token);
      return data.token;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};

export const signup = async (credentials) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (response.ok) {
      await AsyncStorage.setItem('authToken', data.token);
      return data.token;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error signing up:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
