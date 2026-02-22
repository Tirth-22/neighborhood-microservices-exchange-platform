package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.dto.AvailabilityRequest;
import com.tirth.microservices.provider_service.dto.AvailabilityResponse;
import com.tirth.microservices.provider_service.dto.BookSlotRequest;
import com.tirth.microservices.provider_service.dto.TimeSlotResponse;

import java.time.LocalDate;
import java.util.List;

public interface AvailabilityService {

    // Availability Management
    List<AvailabilityResponse> getProviderAvailability(String providerUsername);

    AvailabilityResponse setAvailability(String providerUsername, AvailabilityRequest request);

    List<AvailabilityResponse> setWeeklyAvailability(String providerUsername, List<AvailabilityRequest> requests);

    void deleteAvailability(String providerUsername, Long availabilityId);

    // Time Slot Management
    List<TimeSlotResponse> generateTimeSlots(String providerUsername, LocalDate startDate, LocalDate endDate);

    List<TimeSlotResponse> getAvailableSlots(String providerUsername, LocalDate startDate, LocalDate endDate);

    List<TimeSlotResponse> getProviderSchedule(String providerUsername, LocalDate startDate, LocalDate endDate);

    TimeSlotResponse bookSlot(String username, BookSlotRequest request);

    void cancelSlotBooking(String username, Long slotId);

    List<TimeSlotResponse> getUserBookings(String username);
}
