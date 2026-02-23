package com.tirth.microservices.provider_service.repository;

import com.tirth.microservices.provider_service.entity.ProviderAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderAvailabilityRepository extends JpaRepository<ProviderAvailability, Long> {

    List<ProviderAvailability> findByProviderUsername(String providerUsername);

    List<ProviderAvailability> findByProviderUsernameAndIsAvailableTrue(String providerUsername);

    // Get all availability slots for a specific day (supports multiple slots per day)
    List<ProviderAvailability> findByProviderUsernameAndDayOfWeek(String providerUsername, DayOfWeek dayOfWeek);

    // Check for overlapping time slots on the same day
    @Query("SELECT pa FROM ProviderAvailability pa WHERE pa.providerUsername = :username "
            + "AND pa.dayOfWeek = :dayOfWeek "
            + "AND ((pa.startTime <= :startTime AND pa.endTime > :startTime) "
            + "OR (pa.startTime < :endTime AND pa.endTime >= :endTime) "
            + "OR (pa.startTime >= :startTime AND pa.endTime <= :endTime))")
    List<ProviderAvailability> findOverlappingSlots(
            @Param("username") String providerUsername,
            @Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    // Find availability that covers a specific time
    @Query("SELECT pa FROM ProviderAvailability pa WHERE pa.providerUsername = :username "
            + "AND pa.dayOfWeek = :dayOfWeek "
            + "AND pa.startTime <= :time AND pa.endTime > :time "
            + "AND pa.isAvailable = true")
    Optional<ProviderAvailability> findAvailabilityAtTime(
            @Param("username") String providerUsername,
            @Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("time") LocalTime time);

    void deleteByProviderUsername(String providerUsername);
}
