package com.tirth.microservices.auth_service.controller;

import com.tirth.microservices.auth_service.dto.LoginRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @GetMapping("/auth/test")
    public String test() {
        return "Auth service is working";
    }

    @PostMapping("auth/login")
    public String login(@RequestBody LoginRequest request) {
        return "Recived User : " +  request.getUsername();
    }
}
