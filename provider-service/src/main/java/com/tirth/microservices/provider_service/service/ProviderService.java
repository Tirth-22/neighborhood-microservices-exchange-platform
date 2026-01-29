package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;

import java.util.List;

public interface ProviderService {

    Provider registerProvider(String username);

    Provider getByUsername(String username);

    Provider approveProvider(Long providerId,String adminUsername);

    Provider rejectProvider(Long providerId);

    boolean isProviderActive(String username);

    List<Provider> getAllProviders();
    List<Provider> getProvidersByStatus(ProviderStatus status);
}
