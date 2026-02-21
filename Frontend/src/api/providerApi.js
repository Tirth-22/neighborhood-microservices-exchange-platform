import api from './axiosInstance';

export const providerApi = {
    register: (data) => api.post('/providers/register', data),

    // Service Offerings
    createService: (data) => api.post('/providers/services', data),
    getAllServices: () => api.get('/providers/services'), // Public
    getMyServices: () => api.get('/providers/services/my'),
    deleteService: (id) => api.delete(`/providers/services/${id}`),

    // Admin/Provider actions
    checkActive: (username) => api.get(`/providers/check-active/${username}`),
    getAllProviders: (status) => status ? api.get(`/admin/providers/status/${status}`) : api.get('/admin/providers'),
    approveProvider: (id) => api.put(`/providers/${id}/approve`),
    rejectProvider: (id) => api.put(`/providers/${id}/reject`),
};
