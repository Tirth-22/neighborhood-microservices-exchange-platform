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
    private final com.tirth.microservices.provider_service.repository.ProviderRepository providerRepository;

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
        // Validate provider exists and has timezone set
        var provider = providerRepository.findByUsername(providerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found: " + providerUsername));
        
        if (provider.getTimezone() == null || provider.getTimezone().isEmpty()) {
            throw new IllegalArgumentException("Provider timezone not set. Please update your profile.");
        }
        
        // Validate time range
        if (request.getStartTime() == null || request.getEndTime() == null) {
            throw new IllegalArgumentException("Start time and end time are required");
        }
        
        if (request.getStartTime().isAfter(request.getEndTime())
                || request.getStartTime().equals(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Check for overlapping slots on the same day
        List<ProviderAvailability> overlapping = availabilityRepository.findOverlappingSlots(
                providerUsername,
                request.getDayOfWeek(),
                request.getStartTime(),
                request.getEndTime());

        if (!overlapping.isEmpty()) {
            throw new IllegalArgumentException(
                    "Time slot overlaps with existing availability: "
                            + overlapping.get(0).getStartTime() + " - " + overlapping.get(0).getEndTime()
                            + ". Please choose a different time.");
        }

        ProviderAvailability availability = ProviderAvailability.builder()
                .providerUsername(providerUsername)
                .dayOfWeek(request.getDayOfWeek())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .slotDurationMinutes(request.getSlotDurationMinutes() != null ? request.getSlotDurationMinutes() : 60)
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .build();

        availability = availabilityRepository.save(availability);
        log.info("Production Availability Set: Provider {} on {} [{} to {}]",
                providerUsername, request.getDayOfWeek(), request.getStartTime(), request.getEndTime());

        return toAvailabilityResponse(availability);
    }

    @Override
    @Transactional
    public List<AvailabilityResponse> setWeeklyAvailability(String providerUsername,
            List<AvailabilityRequest> requests) {
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
            throw new IllegalArgumentException("Authorization Failure: Cannot delete another provider's availability");
        }

        availabilityRepository.delete(availability);
        log.info("Availability Removed: ID {} for provider {}", availabilityId, providerUsername);
    }

    @Override
    @Transactional
    public List<TimeSlotResponse> generateTimeSlots(String providerUsername, LocalDate startDate, LocalDate endDate) {
        log.info("[SLOT-GEN] Starting for provider: {}, dates: {} to {}", providerUsername, startDate, endDate);
        
        var provider = providerRepository.findByUsername(providerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found: " + providerUsername));

        log.info("[SLOT-GEN] Provider found: {}, active: {}, timezone: {}", 
                providerUsername, provider.isActive(), provider.getTimezone());

        if (!provider.isActive()) {
            throw new IllegalArgumentException("Provider is not active. Cannot generate slots.");
        }

        java.time.ZoneId providerZone = java.time.ZoneId
                .of(provider.getTimezone() != null ? provider.getTimezone() : "UTC");

        List<ProviderAvailability> allAvailabilities = availabilityRepository
                .findByProviderUsername(providerUsername);
        
        log.info("[SLOT-GEN] Total availability records found: {}", allAvailabilities.size());
        allAvailabilities.forEach(a -> log.info("[SLOT-GEN] DB Record: id={}, day={}, time={}-{}, isAvailable={}", 
                a.getId(), a.getDayOfWeek(), a.getStartTime(), a.getEndTime(), a.getIsAvailable()));
        
        if (allAvailabilities.isEmpty()) {
            log.error("[SLOT-GEN] No weekly availability found for provider: {}", providerUsername);
            throw new IllegalArgumentException("Set your weekly schedule first before generating slots");
        }
        
        List<ProviderAvailability> availabilities = allAvailabilities.stream()
                .filter(a -> a.getIsAvailable() == null || a.getIsAvailable())
                .collect(Collectors.toList());

        log.info("[SLOT-GEN] Active availability records after filter: {}", availabilities.size());
        
        if (availabilities.isEmpty()) {
            log.error("[SLOT-GEN] All availability records are disabled for provider: {}", providerUsername);
            throw new IllegalArgumentException("All weekly availability slots are disabled. Please enable at least one.");
        }

        availabilities.forEach(a -> log.info("[SLOT-GEN] Availability: {} {} to {} (duration: {} min)", 
                a.getDayOfWeek(), a.getStartTime(), a.getEndTime(), a.getSlotDurationMinutes()));

        List<TimeSlot> generatedSlots = new ArrayList<>();
        LocalDate currentDate = startDate;
        int totalDays = 0;

        while (!currentDate.isAfter(endDate)) {
            totalDays++;
            LocalDate finalCurrentDate = currentDate;
            java.time.DayOfWeek dayOfWeek = finalCurrentDate.getDayOfWeek();

            List<ProviderAvailability> dayAvailabilities = availabilities.stream()
                    .filter(a -> a.getDayOfWeek().equals(dayOfWeek))
                    .collect(Collectors.toList());

            log.info("[SLOT-GEN] Date: {}, DayOfWeek: {}, Matching availabilities: {}", 
                    finalCurrentDate, dayOfWeek, dayAvailabilities.size());

            if (!dayAvailabilities.isEmpty()) {
                List<TimeSlot> existingSlots = timeSlotRepository
                        .findByProviderUsernameAndSlotDate(providerUsername, finalCurrentDate);

                if (existingSlots.isEmpty()) {
                    for (ProviderAvailability availability : dayAvailabilities) {
                        java.time.LocalTime currentTime = availability.getStartTime();
                        int slotDuration = availability.getSlotDurationMinutes() != null 
                            ? availability.getSlotDurationMinutes() : 60;

                        int slotsForThisAvailability = 0;
                        while (currentTime.plusMinutes(slotDuration).isBefore(availability.getEndTime()) ||
                                currentTime.plusMinutes(slotDuration).equals(availability.getEndTime())) {

                            TimeSlot slot = TimeSlot.builder()
                                    .providerUsername(providerUsername)
                                    .slotDate(finalCurrentDate)
                                    .startTime(currentTime)
                                    .endTime(currentTime.plusMinutes(slotDuration))
                                    .isBooked(false)
                                    .build();
                            generatedSlots.add(slot);
                            slotsForThisAvailability++;
                            currentTime = currentTime.plusMinutes(slotDuration);
                        }
                        log.info("[SLOT-GEN] Generated {} slots for {} on {}", 
                                slotsForThisAvailability, finalCurrentDate, dayOfWeek);
                    }
                } else {
                    log.info("[SLOT-GEN] Slots already exist for {}, skipping ({} existing)", 
                            finalCurrentDate, existingSlots.size());
                }
            } else {
                log.info("[SLOT-GEN] No availability defined for {} ({})", finalCurrentDate, dayOfWeek);
            }

            currentDate = currentDate.plusDays(1);
        }

        log.info("[SLOT-GEN] Processed {} days, generated {} total slots", totalDays, generatedSlots.size());

        if (generatedSlots.isEmpty()) {
            log.warn("[SLOT-GEN] No new slots generated for {}", providerUsername);
            return new ArrayList<>();
        }

        List<TimeSlot> savedSlots = timeSlotRepository.saveAll(generatedSlots);
        log.info("[SLOT-GEN] SUCCESS: {} slots saved for {} in zone {}",
                savedSlots.size(), providerUsername, providerZone);

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
            throw new IllegalArgumentException("Conflict: This slot is already booked.");
        }

        slot.setIsBooked(true);
        slot.setBookedBy(username);
        slot.setRequestId(request.getRequestId());

        slot = timeSlotRepository.save(slot);
        log.info("Slot Booking Confirmed: ID {} by user {}", request.getSlotId(), username);

        return toTimeSlotResponse(slot);
    }

    @Override
    @Transactional
    public void cancelSlotBooking(String username, Long slotId) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Time slot not found"));

        if (!username.equals(slot.getBookedBy())) {
            throw new IllegalArgumentException("Authorization Failure: Only the original booker can cancel.");
        }

        slot.setIsBooked(false);
        slot.setBookedBy(null);
        slot.setRequestId(null);

        timeSlotRepository.save(slot);
        log.info("Booking Cancelled: Slot ID {} by user {}", slotId, username);
    }

    @Override
    public List<TimeSlotResponse> getUserBookings(String username) {
        return timeSlotRepository.findByBookedBy(username)
                .stream()
                .map(this::toTimeSlotResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isProviderAvailableAt(String providerUsername, java.time.LocalDateTime dateTime) {
        var provider = providerRepository.findByUsername(providerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        java.time.ZoneId zone = java.time.ZoneId.of(provider.getTimezone() != null ? provider.getTimezone() : "UTC");
        java.time.ZonedDateTime requestTime = java.time.ZonedDateTime.of(dateTime, zone);

        java.time.DayOfWeek dayOfWeek = requestTime.getDayOfWeek();
        java.time.LocalTime time = requestTime.toLocalTime();

        var availability = availabilityRepository.findAvailabilityAtTime(
                providerUsername, dayOfWeek, time);

        if (availability.isEmpty()) {
            return false;
        }

        LocalDate date = requestTime.toLocalDate();
        List<TimeSlot> slots = timeSlotRepository.findByProviderUsernameAndSlotDate(providerUsername, date);

        if (slots.isEmpty()) {
            return true;
        }

        return slots.stream()
                .anyMatch(slot -> !slot.getIsBooked()
                        && (slot.getStartTime().equals(time)
                                || (slot.getStartTime().isBefore(time) && slot.getEndTime().isAfter(time))));
    }

    @Override
    public List<AvailabilityResponse> getAvailabilityForDay(String providerUsername, java.time.DayOfWeek dayOfWeek) {
        return availabilityRepository.findByProviderUsernameAndDayOfWeek(providerUsername, dayOfWeek)
                .stream()
                .map(this::toAvailabilityResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean validateTimeSlot(String providerUsername, String slotDate, String startTime) {
        try {
            LocalDate date = LocalDate.parse(slotDate);
            LocalTime time = LocalTime.parse(startTime);

            List<TimeSlot> slots = timeSlotRepository.findByProviderUsernameAndSlotDate(providerUsername, date);
            return slots.stream()
                    .anyMatch(slot -> slot.getStartTime().equals(time) && !slot.getIsBooked());
        } catch (Exception e) {
            log.error("Error validating time slot: {}", e.getMessage());
            return false;
        }
    }

    @Override
    @Transactional
    public void bookTimeSlotForRequest(String providerUsername, String slotDate, String startTime, Long requestId) {
        try {
            LocalDate date = LocalDate.parse(slotDate);
            LocalTime time = LocalTime.parse(startTime);

            List<TimeSlot> slots = timeSlotRepository.findByProviderUsernameAndSlotDate(providerUsername, date);
            TimeSlot slot = slots.stream()
                    .filter(s -> s.getStartTime().equals(time) && !s.getIsBooked())
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Time slot not found or already booked"));

            slot.setIsBooked(true);
            slot.setRequestId(requestId);
            timeSlotRepository.save(slot);
            log.info("Time slot booked: {} {} for request {}", date, time, requestId);
        } catch (Exception e) {
            log.error("Error booking time slot: {}", e.getMessage());
            throw new IllegalArgumentException("Failed to book time slot: " + e.getMessage());
        }
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
