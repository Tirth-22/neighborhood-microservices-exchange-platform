package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.client.ProviderClient;
import com.tirth.microservices.request_service.dto.ProviderLookupResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProviderServiceCaller {

    private final ProviderClient providerClient;

    @CircuitBreaker(name = "provider-service", fallbackMethod = "isProviderActiveFallback")
    public boolean isProviderActive(String username) {
        log.debug("Calling provider-service to check if provider {} is active", username);
        return providerClient.isProviderActive(username);
    }

    @CircuitBreaker(name = "provider-service", fallbackMethod = "getProviderByServiceFallback")
    public ProviderLookupResponse getProviderByService(String serviceType) {
        log.debug("Calling provider-service to get provider for service type: {}", serviceType);
        return providerClient.getProviderByService(serviceType);
    }

    // Fallback methods
    public boolean isProviderActiveFallback(String username, Throwable t) {
        log.warn("Circuit breaker triggered for isProviderActive. Provider service temporarily unavailable. Username: {}", username);
        return false;
    }

    public ProviderLookupResponse getProviderByServiceFallback(String serviceType, Throwable t) {
        log.warn("Circuit breaker triggered for getProviderByService. Provider service temporarily unavailable. Service type: {}", serviceType);
        return null;
    }
}
