package com.tirth.microservices.provider_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    Optional<Provider> findByUsername(String username);
    List<Provider> findByStatus(ProviderStatus status);
    boolean existsByUsername(String username);
    List<Provider> findByServiceTypeAndStatus(com.tirth.microservices.provider_service.entity.ServiceType serviceType, ProviderStatus status);
}
