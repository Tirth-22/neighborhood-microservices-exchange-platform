package com.tirth.microservices.provider_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;
    private Long providerId;
    private Long userId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
