package com.tirth.microservices.provider_service.event;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RequestCompletedEvent {
    private Long requestId;
    private String userId;
    private String providerId;
    private String serviceName;
    private Long serviceOfferingId;
    private Double rating;
    private String completedAt;
}
