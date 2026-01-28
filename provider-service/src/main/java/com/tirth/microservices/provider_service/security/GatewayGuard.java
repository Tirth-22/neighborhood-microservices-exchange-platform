package com.tirth.microservices.provider_service.security;

import org.springframework.stereotype.Component;

@Component
public class GatewayGuard {

    public void validate(String gatewayHeader) {
        if (!"true".equalsIgnoreCase(gatewayHeader)) {
            throw new RuntimeException("Direct access forbidden. Use API Gateway.");
        }
    }
}
