package com.tirth.microservices.provider_service.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.tirth.microservices.provider_service.dto.ProviderRegisterRequest;
import com.tirth.microservices.provider_service.dto.ProviderRegisterResponse;
import com.tirth.microservices.provider_service.dto.ServiceOfferingRequest;
import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import com.tirth.microservices.provider_service.entity.ServiceOffering;

public interface ProviderService {

    ProviderRegisterResponse registerProvider(String username, ProviderRegisterRequest request);

    Provider getByUsername(String username);

    Provider approveProvider(Long providerId, String adminUsername);

    Provider rejectProvider(Long providerId);

    boolean isProviderActive(String username);

    List<Provider> getAllProviders();

    List<Provider> getProvidersByStatus(ProviderStatus status);

    Page<Provider> getAllProviders(Pageable pageable);

    Page<Provider> getProvidersByStatus(ProviderStatus status, Pageable pageable);

    // Service Offering Methods
    ServiceOffering createService(String username, ServiceOfferingRequest request);

    List<ServiceOffering> getAllActiveServices();

    Page<ServiceOffering> getAllActiveServices(Pageable pageable);

    Page<ServiceOffering> searchActiveServices(String q, String category, String providerUsername,
            Double minPrice, Double maxPrice, Pageable pageable);

    List<ServiceOffering> getMyServices(String username);

    void deleteService(Long id, String username, String role);
}
