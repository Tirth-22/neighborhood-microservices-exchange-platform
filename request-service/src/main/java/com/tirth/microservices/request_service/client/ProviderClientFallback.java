package com.tirth.microservices.request_service.client;

import com.tirth.microservices.request_service.dto.ApiResponse;
import com.tirth.microservices.request_service.dto.ProviderLookupResponse;
import org.springframework.stereotype.Component;

@Component
public class ProviderClientFallback implements ProviderClient {

    @Override
    public boolean isProviderActive(String username) {
        // Fallback: If provider service is down, we treat the provider as inactive for
        // safety
        System.err.println(
                "Circuit Breaker: provider-service is unavailable. Fallback 'isProviderActive' for user: " + username);
        return false;
    }

    @Override
    public ProviderLookupResponse getProviderByService(String serviceType) {
        // Fallback: Return null if we can't look up a provider
        System.err
                .println("Circuit Breaker: provider-service is unavailable. Fallback 'getProviderByService' for type: "
                        + serviceType);
        return null;
    }

    @Override
    public ApiResponse<Boolean> checkProviderAvailability(String providerUsername, String dateTime) {
        // Fallback: If provider service is down, return false (provider not available)
        System.err.println(
                "Circuit Breaker: provider-service is unavailable. Fallback 'checkProviderAvailability' for provider: "
                + providerUsername + " at " + dateTime);
        return ApiResponse.error("Provider service unavailable - cannot check availability");
    }

    @Override
    public ApiResponse<Boolean> validateTimeSlot(String providerUsername, String slotDate, String startTime) {
        System.err.println(
                "Circuit Breaker: provider-service is unavailable. Fallback 'validateTimeSlot' for provider: "
                + providerUsername + " at " + slotDate + " " + startTime);
        return ApiResponse.error("Provider service unavailable - cannot validate time slot");
    }

    @Override
    public ApiResponse<Void> bookTimeSlot(String providerUsername, String slotDate, String startTime, Long requestId) {
        System.err.println(
                "Circuit Breaker: provider-service is unavailable. Fallback 'bookTimeSlot' for provider: "
                + providerUsername + " at " + slotDate + " " + startTime);
        return ApiResponse.error("Provider service unavailable - cannot book time slot");
    }
}
