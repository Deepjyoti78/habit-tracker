import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: BASE_URL,
    timeout: 15000, // 15 s — gives Render time to wake from cold start
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

/**
 * Silently ping the backend root so Render wakes up before the user
 * actually tries to log in. Call this once from main.jsx / AppProvider.
 */
export const pingBackend = () =>
    axios.get(BASE_URL.replace('/api', '') + '/', { timeout: 30000 }).catch(() => {});

export default API;