package com.tirth.microservices.provider_service.controller;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import com.tirth.microservices.provider_service.exception.ForbiddenException;
import com.tirth.microservices.provider_service.security.GatewayGuard;
import com.tirth.microservices.provider_service.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    @GetMapping("/paged")
    public Page<Provider> getAllProvidersPaged(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        gatewayGuard.validate(gatewayHeader);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN allowed");
        }

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return providerService.getAllProviders(pageable);
    }

    @GetMapping("/status/{status}/paged")
    public Page<Provider> getProvidersByStatusPaged(
            @PathVariable ProviderStatus status,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        gatewayGuard.validate(gatewayHeader);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN allowed");
        }

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return providerService.getProvidersByStatus(status, pageable);
    }
}
