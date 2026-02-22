package com.tirth.microservices.provider_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookSlotRequest {

    @NotNull(message = "Slot ID is required")
    private Long slotId;

    @NotNull(message = "Request ID is required")
    private Long requestId;
}
