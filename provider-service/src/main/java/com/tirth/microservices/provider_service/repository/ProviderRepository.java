package com.tirth.microservices.provider_service.repository;

import com.tirth.microservices.provider_service.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider,Integer> {

    Optional<Provider> findByUsername(String username);
    Optional<Provider> findById(Long providerId);
}
