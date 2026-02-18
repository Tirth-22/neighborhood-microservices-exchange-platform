package com.tirth.microservices.provider_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tirth.microservices.provider_service.entity.ServiceOffering;

@Repository
public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {
    List<ServiceOffering> findByActiveTrue();
    List<ServiceOffering> findByProviderUsername(String providerUsername);
    List<ServiceOffering> findByCategoryAndActiveTrue(String category);
}
