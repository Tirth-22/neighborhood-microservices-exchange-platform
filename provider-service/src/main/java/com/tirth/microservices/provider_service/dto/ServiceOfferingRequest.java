package com.tirth.microservices.provider_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ServiceOfferingRequest {

    @NotBlank(message = "Service name is required")
    @Size(min = 3, max = 100, message = "Service name must be 3-100 characters")
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be a positive number")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;
}
