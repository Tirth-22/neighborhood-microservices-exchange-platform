package com.tirth.microservices.request_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCreatedEvent {
    private Long requestId;
    private String requestedBy;
    private String providerUsername;
    private String title;
    private String createdAt;
}
