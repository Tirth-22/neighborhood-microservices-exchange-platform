package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.dto.ProviderRegisterRequest;
import com.tirth.microservices.provider_service.dto.ProviderRegisterResponse;
import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;

import java.util.List;

public interface ProviderService {

    ProviderRegisterResponse registerProvider(String username, ProviderRegisterRequest request);

    Provider getByUsername(String username);

    Provider approveProvider(Long providerId,String adminUsername);

    Provider rejectProvider(Long providerId);

    boolean isProviderActive(String username);

    List<Provider> getAllProviders();
    List<Provider> getProvidersByStatus(ProviderStatus status);

    // Service Offering Methods
    com.tirth.microservices.provider_service.entity.ServiceOffering createService(String username, com.tirth.microservices.provider_service.dto.ServiceOfferingRequest request);
    java.util.List<com.tirth.microservices.provider_service.entity.ServiceOffering> getAllActiveServices();
    java.util.List<com.tirth.microservices.provider_service.entity.ServiceOffering> getMyServices(String username);
    void deleteService(Long id, String username, String role);
}
