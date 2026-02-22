package com.tirth.microservices.provider_service.repository;

import com.tirth.microservices.provider_service.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByProviderUsernameAndSlotDate(String providerUsername, LocalDate slotDate);

    List<TimeSlot> findByProviderUsernameAndSlotDateAndIsBookedFalse(String providerUsername, LocalDate slotDate);

    @Query("SELECT t FROM TimeSlot t WHERE t.providerUsername = :username AND t.slotDate BETWEEN :startDate AND :endDate ORDER BY t.slotDate, t.startTime")
    List<TimeSlot> findByProviderUsernameAndDateRange(
            @Param("username") String providerUsername,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT t FROM TimeSlot t WHERE t.providerUsername = :username AND t.slotDate BETWEEN :startDate AND :endDate AND t.isBooked = false ORDER BY t.slotDate, t.startTime")
    List<TimeSlot> findAvailableSlots(
            @Param("username") String providerUsername,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    Optional<TimeSlot> findByIdAndProviderUsername(Long id, String providerUsername);

    List<TimeSlot> findByBookedBy(String bookedBy);

    Optional<TimeSlot> findByRequestId(Long requestId);
}
