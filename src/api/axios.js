import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
    baseURL: BASE_URL,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Global response error handler
API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (!err.response) {
            // Network error or Render cold-start timeout
            console.warn('[API] Network/Connection error – backend may be waking up');
        }
        return Promise.reject(err);
    }
);

export const pingBackend = () => Promise.resolve();

export default API;