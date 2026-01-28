package com.tirth.microservices.request_service.security;

import com.tirth.microservices.request_service.exception.UnauthorizedActionException;
import org.springframework.stereotype.Component;

@Component
public class GatewayGuard {

    public void validate(String gatewayHeader) {
        if (!"true".equals(gatewayHeader)) {
            throw new UnauthorizedActionException("Direct access forbidden");
        }
    }
}
