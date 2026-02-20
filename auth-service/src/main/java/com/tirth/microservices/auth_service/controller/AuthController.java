package com.tirth.microservices.auth_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.tirth.microservices.auth_service.dto.ApiResponse;
import com.tirth.microservices.auth_service.dto.LoginRequest;
import com.tirth.microservices.auth_service.dto.LoginResponse;
import com.tirth.microservices.auth_service.dto.RegisterRequest;
import com.tirth.microservices.auth_service.entity.User;
import com.tirth.microservices.auth_service.repository.UserRepository;
import com.tirth.microservices.auth_service.util.JwtUtil;

@RestController
public class AuthController {

    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/auth/test")
    public String test() {
        return "Auth service is working";
    }

    @PostMapping("/auth/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        // Hardcoded Admin Check
        if ("admin@neighborhood.com".equalsIgnoreCase(request.getUsername())
                || "admin".equalsIgnoreCase(request.getUsername())) {
            if ("admin123".equals(request.getPassword())) {
                String token = jwtUtil.generateToken("admin", "ADMIN", "admin@neighborhood.com");
                return new LoginResponse(true, "ADMIN", token);
            } else {
                return new LoginResponse(false, "Wrong password", null);
            }
        }

        User user = userRepository.findByUsername(request.getUsername());

        if (user == null) {
            return new LoginResponse(false, "User not found", null);
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new LoginResponse(false, "Wrong password", null);
        }

        // Verify role matches
        String selectedRole = request.getRole() != null ? request.getRole().toUpperCase().trim() : "";
        String storedRole = user.getRole() != null ? user.getRole().toUpperCase().trim() : "";

        if (!selectedRole.isEmpty() && !storedRole.equals(selectedRole)) {
            return new LoginResponse(false, "You are registered as " + storedRole + ". Please select the correct role.", null);
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole(),
                user.getEmail());

        return new LoginResponse(true, user.getRole(), token);
    }

    @PostMapping("/auth/register")
    public ApiResponse register(@RequestBody RegisterRequest request) {
        // 1. Validate Field Lengths
        if (request.getUsername() == null || request.getUsername().trim().length() < 6) {
            return new ApiResponse(false, "Username must be at least 6 characters", null);
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new ApiResponse(false, "Password must be at least 6 characters", null);
        }

        // 2. Check for duplicate Username
        String trimmedUsername = request.getUsername().trim();
        if (!userRepository.findAllByUsername(trimmedUsername).isEmpty()) {
            return new ApiResponse(false, "Username already exists", null);
        }

        // 3. Check for duplicate Email
        String normalizedEmail = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        if (!userRepository.findAllByEmail(normalizedEmail).isEmpty()) {
            return new ApiResponse(false, "Email already in use", null);
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(normalizedEmail);
        user.setRole(request.getRole());

        userRepository.save(user);

        return new ApiResponse(true, "USER REGISTERED", null);
    }

}
