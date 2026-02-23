package com.tirth.microservices.request_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import com.tirth.microservices.request_service.dto.ProviderLookupResponse;
import com.tirth.microservices.request_service.dto.ApiResponse;

@FeignClient(name = "provider-service", fallback = ProviderClientFallback.class)
public interface ProviderClient {

    @GetMapping("/providers/check-active/{username}")
    boolean isProviderActive(@PathVariable String username);

    @GetMapping("/providers/active/by-service/{serviceType}")
    ProviderLookupResponse getProviderByService(
            @PathVariable String serviceType);

    @GetMapping("/providers/availability/check")
    ApiResponse<Boolean> checkProviderAvailability(
            @RequestParam String providerUsername,
            @RequestParam String dateTime);

    @GetMapping("/providers/availability/slots/validate")
    ApiResponse<Boolean> validateTimeSlot(
            @RequestParam String providerUsername,
            @RequestParam String slotDate,
            @RequestParam String startTime);

    @GetMapping("/providers/availability/slots/book-slot")
    ApiResponse<Void> bookTimeSlot(
            @RequestParam String providerUsername,
            @RequestParam String slotDate,
            @RequestParam String startTime,
            @RequestParam Long requestId);
}
