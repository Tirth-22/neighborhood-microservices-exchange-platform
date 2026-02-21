package com.tirth.microservices.provider_service.controller;

import com.tirth.microservices.provider_service.dto.*;
import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.entity.ProviderStatus;
import com.tirth.microservices.provider_service.entity.ServiceOffering;
import com.tirth.microservices.provider_service.entity.ServiceType;
import com.tirth.microservices.provider_service.exception.ForbiddenException;
import com.tirth.microservices.provider_service.exception.ResourceNotFoundException;
import com.tirth.microservices.provider_service.repository.ProviderRepository;
import com.tirth.microservices.provider_service.security.GatewayGuard;
import com.tirth.microservices.provider_service.service.ProviderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
@Slf4j
public class ProviderController {

    private final ProviderService providerService;
    private final GatewayGuard gatewayGuard;
    private final ProviderRepository repository;

    @PostMapping("/register")
    public ApiResponse<ProviderRegisterResponse> registerProvider(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader,
            @RequestBody ProviderRegisterRequest request
    ) {
        gatewayGuard.validate(gatewayHeader);

        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only PROVIDER role allowed");
        }

        ProviderRegisterResponse response
                = providerService.registerProvider(username, request);

        return new ApiResponse<>(true, "Registration submitted", response);
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
        log.debug("ROLE RECEIVED = {}", role);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN role allowed");
        }

        return providerService.approveProvider(id, adminUsername);
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

    @GetMapping("/active/by-service/{serviceType}")
    public ProviderLookupResponse getActiveProviderByService(
            @PathVariable String serviceType
    ) {
        ServiceType type = ServiceType.valueOf(serviceType);
        java.util.List<Provider> providers = repository
                .findByServiceTypeAndStatus(type, ProviderStatus.ACTIVE);

        if (providers.isEmpty()) {
            throw new ResourceNotFoundException("No provider available for service type: " + serviceType);
        }

        Provider provider = providers.get(0);

        return new ProviderLookupResponse(provider.getId(), provider.getUsername());
    }

    @PostMapping("/services")
    public ServiceOffering createService(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-Gateway-Request", required = false) String gatewayHeader,
            @RequestBody ServiceOfferingRequest request
    ) {
        if (gatewayHeader != null) {
            gatewayGuard.validate(gatewayHeader);
        }
        log.debug("createService called with role: {}", role);

        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only PROVIDER can create services");
        }

        return providerService.createService(username, request);
    }

    @GetMapping("/services")
    public java.util.List<com.tirth.microservices.provider_service.entity.ServiceOffering> getAllServices() {
        return providerService.getAllActiveServices();
    }

    @GetMapping("/services/my")
    public java.util.List<com.tirth.microservices.provider_service.entity.ServiceOffering> getMyServices(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only PROVIDER can view own services");
        }
        return providerService.getMyServices(username);
    }

    @DeleteMapping("/services/{id}")
    public void deleteService(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        providerService.deleteService(id, username, role);
    }

    @GetMapping
    public java.util.List<Provider> getAllProviders(
            @RequestParam(required = false) String status,
            @RequestHeader("X-User-Role") String role
    ) {
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ForbiddenException("Only ADMIN can view all providers");
        }
        if (status != null) {
            return providerService.getProvidersByStatus(ProviderStatus.valueOf(status.toUpperCase()));
        }
        return providerService.getAllProviders();
    }

}
