package com.tirth.microservices.request_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestAcceptedEvent {

    private Long requestId;
    private Long userId;
    private Long providerId;
    private String serviceName;
    private LocalDateTime acceptedAt;

    public RequestAcceptedEvent(Long id, String requestedBy, String username, String title, LocalDateTime now) {
    }
}
