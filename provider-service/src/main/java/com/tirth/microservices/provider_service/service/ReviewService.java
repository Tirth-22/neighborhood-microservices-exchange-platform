package com.tirth.microservices.provider_service.service;

import com.tirth.microservices.provider_service.dto.ProviderRatingResponse;
import com.tirth.microservices.provider_service.dto.ReviewRequest;
import com.tirth.microservices.provider_service.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {

    ReviewResponse createReview(Long providerId, ReviewRequest request);

    List<ReviewResponse> getReviewsByProviderId(Long providerId);

    ProviderRatingResponse getProviderRating(Long providerId);
}
