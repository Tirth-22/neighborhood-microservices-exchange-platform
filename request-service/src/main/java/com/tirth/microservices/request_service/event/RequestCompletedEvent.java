package com.tirth.microservices.request_service.event;

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
    private String completedAt;
}
