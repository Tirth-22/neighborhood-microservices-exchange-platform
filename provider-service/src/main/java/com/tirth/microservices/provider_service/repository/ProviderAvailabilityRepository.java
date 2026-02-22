package com.tirth.microservices.provider_service.repository;

import com.tirth.microservices.provider_service.entity.ProviderAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderAvailabilityRepository extends JpaRepository<ProviderAvailability, Long> {

    List<ProviderAvailability> findByProviderUsername(String providerUsername);

    List<ProviderAvailability> findByProviderUsernameAndIsAvailableTrue(String providerUsername);

    Optional<ProviderAvailability> findByProviderUsernameAndDayOfWeek(String providerUsername, DayOfWeek dayOfWeek);

    void deleteByProviderUsername(String providerUsername);
}
