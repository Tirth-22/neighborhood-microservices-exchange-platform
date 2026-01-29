package com.tirth.microservices.request_service.security;

import com.tirth.microservices.request_service.exception.UnauthorizedActionException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class GatewayGuard {

    public void validate(String gatewayHeader) {
        if (!"true".equals(gatewayHeader)) {
            throw new UnauthorizedActionException("Direct access forbidden");
        }
    }

    public boolean isSwaggerRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui");
    }
}
