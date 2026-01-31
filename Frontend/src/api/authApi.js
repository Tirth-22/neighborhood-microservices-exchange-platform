import api from './axiosInstance';

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    validateToken: () => api.get('/auth/validate'), // If exists
};
