package com.tirth.microservices.provider_service.repository;

import com.tirth.microservices.provider_service.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProviderIdOrderByCreatedAtDesc(Long providerId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.providerId = :providerId")
    Double findAverageRatingByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.providerId = :providerId")
    Long countByProviderId(@Param("providerId") Long providerId);

    boolean existsByProviderIdAndUserId(Long providerId, Long userId);
}
