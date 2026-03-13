import api from './axiosInstance';

export const requestApi = {
    createRequest: (data) => api.post('/requests', data),
    getMyRequests: () => api.get('/requests/my'),
    getMyRequestsPaged: (params) => api.get('/requests/my/paged', { params }),

    // Provider specific
    getPendingRequests: () => api.get('/requests/pending'),
    getPendingRequestsPaged: (params) => api.get('/requests/pending/paged', { params }),
    getAcceptedRequests: () => api.get('/requests/accepted'),
    getAcceptedRequestsPaged: (params) => api.get('/requests/accepted/paged', { params }),
    getCompletedRequests: () => api.get('/requests/provider/completed'), // Verify endpoint
    getCompletedRequestsPaged: (params) => api.get('/requests/provider/completed/paged', { params }),

    // Actions
    acceptRequest: (id) => api.put(`/requests/${id}/accept`),
    rejectRequest: (id) => api.put(`/requests/${id}/reject`),
    completeRequest: (id, rating) => api.put(`/requests/${id}/complete?rating=${rating}`),
    cancelRequest: (id) => api.put(`/requests/${id}/cancel`),
};
