package com.tirth.microservices.provider_service.controller;

import com.tirth.microservices.provider_service.dto.ApiResponse;
import com.tirth.microservices.provider_service.dto.ProviderRatingResponse;
import com.tirth.microservices.provider_service.dto.ReviewRequest;
import com.tirth.microservices.provider_service.dto.ReviewResponse;
import com.tirth.microservices.provider_service.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/providers/{providerId}/reviews")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @PathVariable Long providerId,
            @Valid @RequestBody ReviewRequest request
    ) {
        log.info("Creating review for provider: {}", providerId);
        ReviewResponse response = reviewService.createReview(providerId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Review created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getProviderReviews(
            @PathVariable Long providerId
    ) {
        log.info("Fetching reviews for provider: {}", providerId);
        List<ReviewResponse> reviews = reviewService.getReviewsByProviderId(providerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reviews fetched successfully", reviews));
    }

    @GetMapping("/rating")
    public ResponseEntity<ApiResponse<ProviderRatingResponse>> getProviderRating(
            @PathVariable Long providerId
    ) {
        log.info("Fetching rating for provider: {}", providerId);
        ProviderRatingResponse rating = reviewService.getProviderRating(providerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Rating fetched successfully", rating));
    }
}
