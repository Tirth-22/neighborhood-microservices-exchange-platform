package com.tirth.microservices.auth_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/provider")
public class ProviderController {

    @GetMapping("/dashboard")
    public String providerDash() {
        return "PROVIDER DASHBOARD";
    }
}
