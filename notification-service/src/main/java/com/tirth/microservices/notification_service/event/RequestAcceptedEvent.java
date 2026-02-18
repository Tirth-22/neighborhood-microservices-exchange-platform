package com.tirth.microservices.notification_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestAcceptedEvent {

    private Long requestId;
    private String userId;
    private String providerId;
    private String serviceName;
    private String acceptedAt;
}
