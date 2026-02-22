package com.tirth.microservices.provider_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderRegisteredEvent {

    private Long providerId;
    private String providerUsername;
    private String serviceType;
}
