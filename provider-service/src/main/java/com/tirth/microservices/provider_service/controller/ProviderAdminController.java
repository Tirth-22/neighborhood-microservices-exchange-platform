package com.tirth.microservices.provider_service.controller;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import com.tirth.microservices.provider_service.exception.ForbiddenException;
import com.tirth.microservices.provider_service.security.GatewayGuard;
import com.tirth.microservices.provider_service.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/providers")
@RequiredArgsConstructor
public class ProviderAdminController {

    private final ProviderService providerService;
    private final GatewayGuard gatewayGuard;

    @GetMapping
    public List<Provider> getAllProviders(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN allowed");
        }

        return providerService.getAllProviders();
    }

    @GetMapping("/status/{status}")
    public List<Provider> getProvidersByStatus(
            @PathVariable ProviderStatus status,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN allowed");
        }

        return providerService.getProvidersByStatus(status);
    }
}
