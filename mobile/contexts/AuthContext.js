import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signin, signup, signout, getAuthToken, getAuthUser } from '../services/auth';

export const handleAuthSuccess = async (token, userData) => {
    await Promise.all([
        // SecureStore.setItemAsync('auth_token', token),
        AsyncStorage.setItem('auth_token', token),
        AsyncStorage.setItem('auth_user', JSON.stringify(userData)),
    ]);
};

export const login = async (credentials) => {
    try {
        const { token, user } = await signin(credentials);
        console.log(token, user);
        await handleAuthSuccess(token, user);
        return true;
    } catch (error) {
        throw error;
    }
};

export const register = async (credentials) => {
    try {
        const { token, user } = await signup(credentials);
        // await handleAuthSuccess(token, user);
        return true;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        await signout();
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

export const loadAuthState = async () => {
    try {
        const [storedToken, storedUser] = await Promise.all([
            getAuthToken(),
            getAuthUser(),
        ]);
        return { storedToken, storedUser };
    } catch (error) {
        console.error('Error loading auth state:', error);
        return { storedToken: null, storedUser: null };
    }
};
