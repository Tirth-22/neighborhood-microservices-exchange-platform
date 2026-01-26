package com.tirth.microservices.request_service.security;

import org.springframework.stereotype.Component;

@Component
public class GatewayGuard {

    public void validate(String gatewayHeader) {
        if (!"true".equals(gatewayHeader)) {
            throw new RuntimeException("Direct access forbidden");
        }
    }
}
