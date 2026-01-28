package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.entity.Provider;

public interface ProviderService {

    Provider registerProvider(String username);

    Provider getByUsername(String username);

    Provider approveProvider(Long providerId);

    Provider rejectProvider(Long providerId);

    boolean isProviderActive(String username);
}
