package com.tirth.microservices.request_service.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateRequestRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 100, message = "Title must be 3-100 characters")
    private String title;

    @NotBlank(message = "Service type is required")
    private String serviceType;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private String providerUsername;

    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Address is required")
    private String address;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledAt;

    private Long serviceOfferingId;
    private String paymentMethod;
}
