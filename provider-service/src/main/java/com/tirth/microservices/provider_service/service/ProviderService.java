package com.tirth.microservices.provider_service.service;

import java.util.List;

import com.tirth.microservices.provider_service.dto.ProviderRegisterRequest;
import com.tirth.microservices.provider_service.dto.ProviderRegisterResponse;
import com.tirth.microservices.provider_service.dto.ServiceOfferingRequest;
import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import com.tirth.microservices.provider_service.entity.ServiceOffering;

public interface ProviderService {

    ProviderRegisterResponse registerProvider(String username, ProviderRegisterRequest request);

    Provider getByUsername(String username);

    Provider approveProvider(Long providerId,String adminUsername);

    Provider rejectProvider(Long providerId);

    boolean isProviderActive(String username);

    List<Provider> getAllProviders();
    List<Provider> getProvidersByStatus(ProviderStatus status);

    // Service Offering Methods
    ServiceOffering createService(String username, ServiceOfferingRequest request);
    List<ServiceOffering> getAllActiveServices();
    List<ServiceOffering> getMyServices(String username);
    void deleteService(Long id, String username, String role);
}
