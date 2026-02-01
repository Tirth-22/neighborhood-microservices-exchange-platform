package com.tirth.microservices.notification_service.dto;

import java.time.LocalDateTime;

public record NotificationResponseDTO(
        Long id,
        String message,
        boolean read,
        LocalDateTime createdAt,
        Long requestId,
        String type
) {}
