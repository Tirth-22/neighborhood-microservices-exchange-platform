package com.tirth.microservices.provider_service.repository;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    Optional<Provider> findByUsername(String username);
    List<Provider> findByStatus(ProviderStatus status);
    boolean existsByUsername(String username);
    java.util.Optional<Provider> findByServiceTypeAndStatus(com.tirth.microservices.provider_service.entity.ServiceType serviceType, ProviderStatus status);
}
