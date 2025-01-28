import axios from 'axios';
import { auth } from '../firebase.config';

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to attach Firebase token
API.interceptors.request.use(async (config) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (error) {
        console.error('Token retrieval error:', error);
        return Promise.reject(error);
    }
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            auth.signOut().then(() => {
                window.location.href = '/login';
            });
        }
        return Promise.reject(error);
    }
);

export default API;