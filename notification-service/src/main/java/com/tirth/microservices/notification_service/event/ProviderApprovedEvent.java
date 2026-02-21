package com.tirth.microservices.notification_service.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProviderApprovedEvent {

    private Long providerId;
    private String providerUsername;
    private String serviceType;
    private String approvedBy;
}
