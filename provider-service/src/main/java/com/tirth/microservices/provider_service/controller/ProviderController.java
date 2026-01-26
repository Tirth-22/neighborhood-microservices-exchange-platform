package com.tirth.microservices.provider_service.controller;

import com.tirth.microservices.provider_service.entity.Provider;
import com.tirth.microservices.provider_service.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @PostMapping("/register")
    public Provider registerProvider(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only PROVIDER role allowed");
        }

        return providerService.registerProvider(username);
    }

    @GetMapping("/{username}/status")
    public boolean isProviderActive(@PathVariable String username) {
        return providerService.isProviderActive(username);
    }

    @PutMapping("/{id}/approve")
    public Provider approve(@PathVariable Long id) {
        return providerService.approveProvider(id);
    }

    @PutMapping("/{id}/reject")
    public Provider reject(@PathVariable Long id) {
        return providerService.rejectProvider(id);
    }
}
