package com.tirth.microservices.provider_service.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tirth.microservices.provider_service.entity.ServiceOffering;

@Repository
public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, Long> {

    List<ServiceOffering> findByActiveTrue();

    Page<ServiceOffering> findByActiveTrue(Pageable pageable);

    List<ServiceOffering> findByProviderUsername(String providerUsername);

    Page<ServiceOffering> findByProviderUsername(String providerUsername, Pageable pageable);

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

    @Query("""
        SELECT s FROM ServiceOffering s
        WHERE s.active = true
          AND (:q IS NULL OR :q = '' OR
               LOWER(s.name) LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(COALESCE(s.description, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(COALESCE(s.category, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR
               LOWER(COALESCE(s.providerUsername, '')) LIKE LOWER(CONCAT('%', :q, '%')))
          AND (:category IS NULL OR :category = '' OR UPPER(s.category) = UPPER(:category))
          AND (:providerUsername IS NULL OR :providerUsername = '' OR LOWER(s.providerUsername) = LOWER(:providerUsername))
          AND (:minPrice IS NULL OR s.price >= :minPrice)
          AND (:maxPrice IS NULL OR s.price <= :maxPrice)
        """)
    Page<ServiceOffering> searchActiveServices(
            @Param("q") String q,
            @Param("category") String category,
            @Param("providerUsername") String providerUsername,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            Pageable pageable);
}
