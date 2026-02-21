package com.tirth.microservices.provider_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tirth.microservices.provider_service.entity.ServiceOffering;

@Repository
public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {

    List<ServiceOffering> findByActiveTrue();

    List<ServiceOffering> findByProviderUsername(String providerUsername);

    List<ServiceOffering> findByCategoryAndActiveTrue(String category);

    /**
     * Atomic update for rating to prevent race conditions. Uses database-level
     * arithmetic to ensure consistency.
     */
    @Modifying
    @Query("""
        UPDATE ServiceOffering s 
        SET s.averageRating = CASE 
                WHEN s.reviewCount = 0 OR s.reviewCount IS NULL THEN :rating 
                ELSE ((COALESCE(s.averageRating, 0.0) * COALESCE(s.reviewCount, 0)) + :rating) / (COALESCE(s.reviewCount, 0) + 1) 
            END,
            s.reviewCount = COALESCE(s.reviewCount, 0) + 1
        WHERE s.id = :id
        """)
    int updateRatingAtomically(@Param("id") Long id, @Param("rating") Double rating);
}
