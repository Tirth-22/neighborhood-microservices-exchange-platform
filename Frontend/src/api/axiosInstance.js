import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
const PUBLIC_PATHS = new Set([
    '/',
    '/signin',
    '/login',
    '/signup',
    '/services',
    '/faq',
    '/help',
    '/privacy',
    '/terms',
    '/contact',
    '/how-it-works',
]);

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error('Request timeout: backend is taking too long to respond.'));
        }

        if (error.response?.status === 401) {
            const hadAuthState = Boolean(
                localStorage.getItem('token') ||
                sessionStorage.getItem('token') ||
                localStorage.getItem('currentUser') ||
                sessionStorage.getItem('currentUser')
            );

            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('currentUser');

            const currentPath = window.location.pathname;
            const isPublicPath = PUBLIC_PATHS.has(currentPath);

            if (hadAuthState && !isPublicPath && currentPath !== '/signin') {
                window.location.href = '/signin';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
