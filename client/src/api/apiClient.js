import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
});

apiClient.interceptors.request.use(async (config) => {
    const token = await localStorage.getItem('token');

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
                localStorage.removeItem('token'),
                localStorage.removeItem('user'),
            ]);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
