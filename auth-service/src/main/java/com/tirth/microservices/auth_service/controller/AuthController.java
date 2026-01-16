package com.tirth.microservices.auth_service.controller;

import com.tirth.microservices.auth_service.dto.LoginRequest;
import com.tirth.microservices.auth_service.entity.User;
import com.tirth.microservices.auth_service.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/auth/test")
    public String test() {
        return "Auth service is working";
    }

    @PostMapping("/auth/login")
    public String login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            return "User not found";
        }
        if (user.getPassword().equals(request.getPassword())) {
            return "LOGIN SUCCESS";
        }

        return "WRONG PASSWORD";
    }
}
