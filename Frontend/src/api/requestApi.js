import api from './axiosInstance';

export const requestApi = {
    createRequest: (data) => api.post('/requests', data),
    getMyRequests: () => api.get('/requests/my'),

    // Provider specific
    getPendingRequests: () => api.get('/requests/pending'),
    getAcceptedRequests: () => api.get('/requests/accepted'),
    getCompletedRequests: () => api.get('/requests/provider/completed'), // Verify endpoint

    // Actions
    acceptRequest: (id) => api.put(`/requests/${id}/accept`),
    rejectRequest: (id) => api.put(`/requests/${id}/reject`),
    completeRequest: (id) => api.put(`/requests/${id}/complete`),
    cancelRequest: (id) => api.put(`/requests/${id}/cancel`),
};
