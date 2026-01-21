package com.tirth.microservices.notification_service.event;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RequestAcceptedEvent {

    private Long requestId;
    private String userId;
    private String providerId;
    private String serviceName;
    private LocalDateTime acceptedAt;
}
