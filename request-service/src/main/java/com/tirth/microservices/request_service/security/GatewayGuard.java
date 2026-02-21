package com.tirth.microservices.request_service.security;

import com.tirth.microservices.request_service.exception.UnauthorizedActionException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GatewayGuard {

    @Value("${gateway.secret}")
    private String gatewaySecret;

    public void validate(String gatewayHeader) {
        if (gatewayHeader == null || !gatewayHeader.equals(gatewaySecret)) {
            throw new UnauthorizedActionException(
            "Direct access forbidden. Use API Gateway.");
        }
                
            
        public boolean isSwaggerRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
    

        return path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui");
    }
}
