package com.tirth.microservices.provider_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderRatingResponse {

    private Long providerId;
    private Double averageRating;
    private Long totalReviews;
}
