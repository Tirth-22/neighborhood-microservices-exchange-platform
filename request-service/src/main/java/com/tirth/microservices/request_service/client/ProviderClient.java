package com.tirth.microservices.request_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import com.tirth.microservices.request_service.dto.ProviderLookupResponse;

@FeignClient(name = "provider-service")
public interface ProviderClient {

    @GetMapping("/providers/check-active/{username}")
    boolean isProviderActive(@PathVariable String username);

    @GetMapping("/providers/active/by-service/{serviceType}")
    ProviderLookupResponse getProviderByService(
            @PathVariable String serviceType
    );
}


