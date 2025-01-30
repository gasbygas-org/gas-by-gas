// src/api/config.js
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

// API endpoints object
const endpoints = {
    // Gas Requests
    requests: {
        getAll: () => API.get('/user/gas/requests'),
        getById: (id) => API.get(`/user/gas/requests/${id}`),
        create: (data) => API.post('/user/gas', data),
        filter: (params) => API.get('/request/filter-gas-requests', { params }),
    },

    // Tokens
    tokens: {
        getActive: () => API.get('/user/active-token'),
    },

    // Notifications
    notifications: {
        getAll: () => API.get('/user/notifications'),
        markAsRead: (id) => API.patch(`/user/notifications/${id}/read`),
    },

    // Stock
    stock: {
        checkAvailability: (outletId, params) => 
            API.get(`/outlets/${outletId}/stock`, { params }),
    },

    // Authentication
    auth: {
        login: (credentials) => API.post('/auth/login', credentials),
        register: (userData) => API.post('/auth/register', userData),
        forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    }
};

// Export both the API instance and endpoints
export { API, endpoints };
export default API;
