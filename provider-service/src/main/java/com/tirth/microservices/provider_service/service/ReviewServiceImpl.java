package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.dto.ProviderRatingResponse;
import com.tirth.microservices.provider_service.dto.ReviewRequest;
import com.tirth.microservices.provider_service.dto.ReviewResponse;
import com.tirth.microservices.provider_service.entity.Review;
import com.tirth.microservices.provider_service.exception.DuplicateProviderException;
import com.tirth.microservices.provider_service.exception.ResourceNotFoundException;
import com.tirth.microservices.provider_service.repository.ProviderRepository;
import com.tirth.microservices.provider_service.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProviderRepository providerRepository;

    @Override
    public ReviewResponse createReview(Long providerId, ReviewRequest request) {
        // Verify provider exists
        if (!providerRepository.existsById(providerId)) {
            throw new ResourceNotFoundException("Provider not found with id: " + providerId);
        }

        // Check if user already reviewed this provider
        if (reviewRepository.existsByProviderIdAndUserId(providerId, request.getUserId())) {
            throw new DuplicateProviderException("User has already reviewed this provider");
        }

        Review review = Review.builder()
                .providerId(providerId)
                .userId(request.getUserId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review saved = reviewRepository.save(review);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProviderId(Long providerId) {
        // Verify provider exists
        if (!providerRepository.existsById(providerId)) {
            throw new ResourceNotFoundException("Provider not found with id: " + providerId);
        }

        return reviewRepository.findByProviderIdOrderByCreatedAtDesc(providerId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderRatingResponse getProviderRating(Long providerId) {
        // Verify provider exists
        if (!providerRepository.existsById(providerId)) {
            throw new ResourceNotFoundException("Provider not found with id: " + providerId);
        }

        Double averageRating = reviewRepository.findAverageRatingByProviderId(providerId);
        Long totalReviews = reviewRepository.countByProviderId(providerId);

        return ProviderRatingResponse.builder()
                .providerId(providerId)
                .averageRating(averageRating != null ? Math.round(averageRating * 100.0) / 100.0 : 0.0)
                .totalReviews(totalReviews != null ? totalReviews : 0L)
                .build();
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .providerId(review.getProviderId())
                .userId(review.getUserId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
