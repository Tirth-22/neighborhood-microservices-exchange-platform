package com.tirth.microservices.provider_service.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class GatewayGuard {

    public void validate(String gatewayHeader) {
        if (!"true".equalsIgnoreCase(gatewayHeader)) {
            throw new RuntimeException("Direct access forbidden. Use API Gateway.");
        }
    }

    public boolean isSwaggerRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui");
    }
}
