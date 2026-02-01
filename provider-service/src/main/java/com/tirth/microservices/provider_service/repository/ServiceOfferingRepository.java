package com.tirth.microservices.provider_service.repository;

import com.tirth.microservices.provider_service.entity.ServiceOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {
    List<ServiceOffering> findByActiveTrue();
    List<ServiceOffering> findByProviderUsername(String providerUsername);
    List<ServiceOffering> findByCategoryAndActiveTrue(String category);
}
