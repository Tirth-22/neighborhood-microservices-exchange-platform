package com.tirth.microservices.request_service.client;

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
}
