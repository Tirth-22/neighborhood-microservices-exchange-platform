package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.entity.Provider;

public interface ProviderService {

    Provider registerProvider(String username);
    boolean isProviderActive(String username);
    Provider approveProvider(Long providerId);
    Provider rejectProvider(Long providerId);
    Provider getByUsername(String username);
}
