import api from './axiosInstance';

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    validateToken: () => api.get('/auth/validate'), // If exists
    forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
    resetPassword: (payload) => api.post('/auth/reset-password', payload),
    verifyEmail: (token) => api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`),
    resendVerification: (payload) => api.post('/auth/resend-verification', payload),
    getAccount: () => api.get('/auth/account'),
    updateAccount: (payload) => api.put('/auth/account', payload),
    changePassword: (payload) => api.put('/auth/change-password', payload),
    deleteAccount: (payload) => api.delete('/auth/account', { data: payload }),
};
