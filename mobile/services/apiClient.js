import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const apiClient = axios.create({
    baseURL: Constants.expoConfig.extra.serverUrl,
});

apiClient.interceptors.request.use(async (config) => {
    // const token = await SecureStore.getItemAsync('auth_token');
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 401) {
            await Promise.all([
                // SecureStore.deleteItemAsync('auth_token'),
                AsyncStorage.removeItem('auth_token'),
                AsyncStorage.removeItem('auth_user'),
            ]);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
