import api from './axiosInstance';

export const availabilityApi = {
    // Get provider availability
    getProviderAvailability: (providerUsername) => 
        api.get(`/providers/availability/${providerUsername}`),
    
    // Set availability for a day
    setAvailability: (availabilityData) => 
        api.post('/providers/availability', availabilityData),
    
    // Set weekly availability
    setWeeklyAvailability: (availabilityList) => 
        api.post('/providers/availability/weekly', availabilityList),
    
    // Delete availability
    deleteAvailability: (availabilityId) => 
        api.delete(`/providers/availability/${availabilityId}`),
    
    // Generate time slots
    generateTimeSlots: (startDate, endDate) => 
        api.post(`/providers/availability/slots/generate?startDate=${startDate}&endDate=${endDate}`),
    
    // Get available slots for a provider
    getAvailableSlots: (providerUsername, startDate, endDate) => 
        api.get(`/providers/availability/slots/${providerUsername}?startDate=${startDate}&endDate=${endDate}`),
    
    // Get provider schedule
    getProviderSchedule: (startDate, endDate) => 
        api.get(`/providers/availability/slots/schedule?startDate=${startDate}&endDate=${endDate}`),
    
    // Book a slot
    bookSlot: (slotId, requestId) => 
        api.post('/providers/availability/slots/book', { slotId, requestId }),
    
    // Cancel slot booking
    cancelSlotBooking: (slotId) => 
        api.delete(`/providers/availability/slots/${slotId}/cancel`),
    
    // Get user's bookings
    getMyBookings: () => 
        api.get('/providers/availability/slots/my-bookings'),
};
