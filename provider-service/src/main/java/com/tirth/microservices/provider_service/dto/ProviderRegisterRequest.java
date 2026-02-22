package com.tirth.microservices.provider_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ProviderRegisterRequest {

    @NotBlank(message = "Service type is required")
    @Pattern(regexp = "^[A-Z_]+$", message = "Service type must be uppercase with underscores (e.g., ELECTRICIAN, PET_CARE)")
    private String serviceType;

}
