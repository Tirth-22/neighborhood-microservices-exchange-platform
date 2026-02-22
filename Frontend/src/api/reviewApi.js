import api from './axiosInstance';

export const reviewApi = {
    // Get reviews for a provider
    getProviderReviews: (providerUsername) => 
        api.get(`/providers/reviews/${providerUsername}`),
    
    // Get reviews for a specific service
    getServiceReviews: (serviceId) => 
        api.get(`/providers/reviews/service/${serviceId}`),
    
    // Submit a review
    submitReview: (reviewData) => 
        api.post('/providers/reviews', reviewData),
    
    // Get reviews by current user
    getMyReviews: () => 
        api.get('/providers/reviews/my'),
    
    // Update a review
    updateReview: (reviewId, reviewData) => 
        api.put(`/providers/reviews/${reviewId}`, reviewData),
    
    // Delete a review
    deleteReview: (reviewId) => 
        api.delete(`/providers/reviews/${reviewId}`),
    
    // Get provider rating summary
    getProviderRating: (providerUsername) => 
        api.get(`/providers/reviews/${providerUsername}/rating`),
};
