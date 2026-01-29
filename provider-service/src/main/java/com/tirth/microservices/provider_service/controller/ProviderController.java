package com.tirth.microservices.provider_service.controller;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.exception.ForbiddenException;
import com.tirth.microservices.provider_service.security.GatewayGuard;
import com.tirth.microservices.provider_service.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;
    private final GatewayGuard gatewayGuard;

    @PostMapping("/register")
    public Provider registerProvider(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);

        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only PROVIDER role allowed");
        }

        return providerService.registerProvider(username);
    }

    @GetMapping("/check-active/{username}")
    public boolean isProviderActive(
            @PathVariable String username,
            @RequestHeader("X-Gateway-Request") String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);
        return providerService.isProviderActive(username);
    }

    @PutMapping("/{id}/approve")
    public Provider approve(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String adminUsername,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);
        System.out.println("ROLE RECEIVED = " + role);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN role allowed");
        }

        return providerService.approveProvider(id,adminUsername);
    }

    @PutMapping("/{id}/reject")
    public Provider reject(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);

        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN role allowed");
        }

        return providerService.rejectProvider(id);
    }

}
