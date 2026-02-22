package com.tirth.microservices.provider_service.controller;

import com.tirth.microservices.provider_service.dto.*;
import com.tirth.microservices.provider_service.service.AvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/providers/availability")
@RequiredArgsConstructor
@Tag(name = "Availability Management", description = "APIs for managing provider availability and time slots")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    // ==================== Provider Availability ====================
    @GetMapping("/{providerUsername}")
    @Operation(summary = "Get provider's weekly availability schedule")
    public ResponseEntity<ApiResponse<List<AvailabilityResponse>>> getProviderAvailability(
            @PathVariable String providerUsername) {
        List<AvailabilityResponse> availability = availabilityService.getProviderAvailability(providerUsername);
        return ResponseEntity.ok(ApiResponse.success("Provider availability retrieved", availability));
    }

    @PostMapping
    @Operation(summary = "Set availability for a specific day (provider only)")
    public ResponseEntity<ApiResponse<AvailabilityResponse>> setAvailability(
            @RequestHeader("X-User-Name") String username,
            @Valid @RequestBody AvailabilityRequest request) {
        AvailabilityResponse response = availabilityService.setAvailability(username, request);
        return ResponseEntity.ok(ApiResponse.success("Availability set successfully", response));
    }

    @PostMapping("/weekly")
    @Operation(summary = "Set weekly availability schedule (provider only)")
    public ResponseEntity<ApiResponse<List<AvailabilityResponse>>> setWeeklyAvailability(
            @RequestHeader("X-User-Name") String username,
            @Valid @RequestBody List<AvailabilityRequest> requests) {
        List<AvailabilityResponse> responses = availabilityService.setWeeklyAvailability(username, requests);
        return ResponseEntity.ok(ApiResponse.success("Weekly availability set", responses));
    }

    @DeleteMapping("/{availabilityId}")
    @Operation(summary = "Delete a specific availability entry (provider only)")
    public ResponseEntity<ApiResponse<Void>> deleteAvailability(
            @RequestHeader("X-User-Name") String username,
            @PathVariable Long availabilityId) {
        availabilityService.deleteAvailability(username, availabilityId);
        return ResponseEntity.ok(ApiResponse.success("Availability deleted", null));
    }

    // ==================== Time Slots ====================
    @PostMapping("/slots/generate")
    @Operation(summary = "Generate time slots based on availability (provider only)")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> generateTimeSlots(
            @RequestHeader("X-User-Name") String username,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TimeSlotResponse> slots = availabilityService.generateTimeSlots(username, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Time slots generated", slots));
    }

    @GetMapping("/slots/{providerUsername}")
    @Operation(summary = "Get available time slots for a provider")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> getAvailableSlots(
            @PathVariable String providerUsername,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TimeSlotResponse> slots = availabilityService.getAvailableSlots(providerUsername, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Available slots retrieved", slots));
    }

    @GetMapping("/slots/schedule")
    @Operation(summary = "Get provider's full schedule including booked slots (provider only)")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> getProviderSchedule(
            @RequestHeader("X-User-Name") String username,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<TimeSlotResponse> slots = availabilityService.getProviderSchedule(username, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Provider schedule retrieved", slots));
    }

    @PostMapping("/slots/book")
    @Operation(summary = "Book a time slot for a service request")
    public ResponseEntity<ApiResponse<TimeSlotResponse>> bookSlot(
            @RequestHeader("X-User-Name") String username,
            @Valid @RequestBody BookSlotRequest request) {
        TimeSlotResponse slot = availabilityService.bookSlot(username, request);
        return ResponseEntity.ok(ApiResponse.success("Slot booked successfully", slot));
    }

    @DeleteMapping("/slots/{slotId}/cancel")
    @Operation(summary = "Cancel a slot booking")
    public ResponseEntity<ApiResponse<Void>> cancelSlotBooking(
            @RequestHeader("X-User-Name") String username,
            @PathVariable Long slotId) {
        availabilityService.cancelSlotBooking(username, slotId);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", null));
    }

    @GetMapping("/slots/my-bookings")
    @Operation(summary = "Get user's booked slots")
    public ResponseEntity<ApiResponse<List<TimeSlotResponse>>> getUserBookings(
            @RequestHeader("X-User-Name") String username) {
        List<TimeSlotResponse> bookings = availabilityService.getUserBookings(username);
        return ResponseEntity.ok(ApiResponse.success("User bookings retrieved", bookings));
    }
}
