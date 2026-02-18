package com.tirth.microservices.request_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCancelledEvent {
    private Long requestId;
    private String requestedBy;      // User who cancelled
    private String providerUsername; // Provider who should be notified
    private String title;
    private String cancelledAt;
}
