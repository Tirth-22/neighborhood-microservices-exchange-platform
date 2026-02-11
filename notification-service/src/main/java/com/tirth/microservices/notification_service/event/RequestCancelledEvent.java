package com.tirth.microservices.notification_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestCancelledEvent {
    private Long requestId;
    private String userId;
    private String providerUsername;
    private String title;
    private String cancelledAt;
}
