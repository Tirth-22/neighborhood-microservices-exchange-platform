package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.dto.AvailabilityRequest;
import com.tirth.microservices.provider_service.dto.AvailabilityResponse;
import com.tirth.microservices.provider_service.dto.BookSlotRequest;
import com.tirth.microservices.provider_service.dto.TimeSlotResponse;
import com.tirth.microservices.provider_service.entity.ProviderAvailability;
import com.tirth.microservices.provider_service.entity.TimeSlot;
import com.tirth.microservices.provider_service.exception.ResourceNotFoundException;
import com.tirth.microservices.provider_service.repository.ProviderAvailabilityRepository;
import com.tirth.microservices.provider_service.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AvailabilityServiceImpl implements AvailabilityService {

    private final ProviderAvailabilityRepository availabilityRepository;
    private final TimeSlotRepository timeSlotRepository;

    @Override
    public List<AvailabilityResponse> getProviderAvailability(String providerUsername) {
        return availabilityRepository.findByProviderUsername(providerUsername)
                .stream()
                .map(this::toAvailabilityResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AvailabilityResponse setAvailability(String providerUsername, AvailabilityRequest request) {
        // Check if availability already exists for this day
        var existing = availabilityRepository.findByProviderUsernameAndDayOfWeek(
                providerUsername, request.getDayOfWeek());

        ProviderAvailability availability;
        if (existing.isPresent()) {
            availability = existing.get();
            availability.setStartTime(request.getStartTime());
            availability.setEndTime(request.getEndTime());
            availability.setSlotDurationMinutes(request.getSlotDurationMinutes());
            availability.setIsAvailable(request.getIsAvailable());
        } else {
            availability = ProviderAvailability.builder()
                    .providerUsername(providerUsername)
                    .dayOfWeek(request.getDayOfWeek())
                    .startTime(request.getStartTime())
                    .endTime(request.getEndTime())
                    .slotDurationMinutes(request.getSlotDurationMinutes() != null ? request.getSlotDurationMinutes() : 60)
                    .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                    .build();
        }

        availability = availabilityRepository.save(availability);
        log.info("Set availability for provider {} on {}", providerUsername, request.getDayOfWeek());

        return toAvailabilityResponse(availability);
    }

    @Override
    @Transactional
    public List<AvailabilityResponse> setWeeklyAvailability(String providerUsername, List<AvailabilityRequest> requests) {
        return requests.stream()
                .map(req -> setAvailability(providerUsername, req))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAvailability(String providerUsername, Long availabilityId) {
        var availability = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Availability not found"));

        if (!availability.getProviderUsername().equals(providerUsername)) {
            throw new IllegalArgumentException("Cannot delete another provider's availability");
        }

        availabilityRepository.delete(availability);
        log.info("Deleted availability {} for provider {}", availabilityId, providerUsername);
    }

    @Override
    @Transactional
    public List<TimeSlotResponse> generateTimeSlots(String providerUsername, LocalDate startDate, LocalDate endDate) {
        List<ProviderAvailability> availabilities = availabilityRepository
                .findByProviderUsernameAndIsAvailableTrue(providerUsername);

        if (availabilities.isEmpty()) {
            throw new IllegalArgumentException("No availability set for provider. Please set availability first.");
        }

        List<TimeSlot> generatedSlots = new ArrayList<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            LocalDate finalCurrentDate = currentDate;

            // Find availability for this day of week
            availabilities.stream()
                    .filter(a -> a.getDayOfWeek() == finalCurrentDate.getDayOfWeek())
                    .findFirst()
                    .ifPresent(availability -> {
                        // Check if slots already exist for this date
                        List<TimeSlot> existingSlots = timeSlotRepository
                                .findByProviderUsernameAndSlotDate(providerUsername, finalCurrentDate);

                        if (existingSlots.isEmpty()) {
                            // Generate time slots based on availability
                            LocalTime currentTime = availability.getStartTime();
                            int slotDuration = availability.getSlotDurationMinutes();

                            while (currentTime.plusMinutes(slotDuration).compareTo(availability.getEndTime()) <= 0) {
                                TimeSlot slot = TimeSlot.builder()
                                        .providerUsername(providerUsername)
                                        .slotDate(finalCurrentDate)
                                        .startTime(currentTime)
                                        .endTime(currentTime.plusMinutes(slotDuration))
                                        .isBooked(false)
                                        .build();
                                generatedSlots.add(slot);
                                currentTime = currentTime.plusMinutes(slotDuration);
                            }
                        }
                    });

            currentDate = currentDate.plusDays(1);
        }

        List<TimeSlot> savedSlots = timeSlotRepository.saveAll(generatedSlots);
        log.info("Generated {} time slots for provider {} from {} to {}",
                savedSlots.size(), providerUsername, startDate, endDate);

        return savedSlots.stream().map(this::toTimeSlotResponse).collect(Collectors.toList());
    }

    @Override
    public List<TimeSlotResponse> getAvailableSlots(String providerUsername, LocalDate startDate, LocalDate endDate) {
        return timeSlotRepository.findAvailableSlots(providerUsername, startDate, endDate)
                .stream()
                .map(this::toTimeSlotResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TimeSlotResponse> getProviderSchedule(String providerUsername, LocalDate startDate, LocalDate endDate) {
        return timeSlotRepository.findByProviderUsernameAndDateRange(providerUsername, startDate, endDate)
                .stream()
                .map(this::toTimeSlotResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TimeSlotResponse bookSlot(String username, BookSlotRequest request) {
        TimeSlot slot = timeSlotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        if (slot.getIsBooked()) {
            throw new IllegalArgumentException("This slot is already booked");
        }

        slot.setIsBooked(true);
        slot.setBookedBy(username);
        slot.setRequestId(request.getRequestId());

        slot = timeSlotRepository.save(slot);
        log.info("Slot {} booked by user {} for request {}", request.getSlotId(), username, request.getRequestId());

        return toTimeSlotResponse(slot);
    }

    @Override
    @Transactional
    public void cancelSlotBooking(String username, Long slotId) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        if (!username.equals(slot.getBookedBy())) {
            throw new IllegalArgumentException("Only the user who booked can cancel");
        }

        slot.setIsBooked(false);
        slot.setBookedBy(null);
        slot.setRequestId(null);

        timeSlotRepository.save(slot);
        log.info("Slot {} booking cancelled by user {}", slotId, username);
    }

    @Override
    public List<TimeSlotResponse> getUserBookings(String username) {
        return timeSlotRepository.findByBookedBy(username)
                .stream()
                .map(this::toTimeSlotResponse)
                .collect(Collectors.toList());
    }

    private AvailabilityResponse toAvailabilityResponse(ProviderAvailability availability) {
        return AvailabilityResponse.builder()
                .id(availability.getId())
                .providerUsername(availability.getProviderUsername())
                .dayOfWeek(availability.getDayOfWeek())
                .startTime(availability.getStartTime())
                .endTime(availability.getEndTime())
                .slotDurationMinutes(availability.getSlotDurationMinutes())
                .isAvailable(availability.getIsAvailable())
                .build();
    }

    private TimeSlotResponse toTimeSlotResponse(TimeSlot slot) {
        return TimeSlotResponse.builder()
                .id(slot.getId())
                .providerUsername(slot.getProviderUsername())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .isBooked(slot.getIsBooked())
                .bookedBy(slot.getBookedBy())
                .requestId(slot.getRequestId())
                .build();
    }
}
