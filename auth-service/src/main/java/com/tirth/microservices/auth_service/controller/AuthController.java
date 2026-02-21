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

import jakarta.validation.Valid;

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
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername());

        if (user == null) {
            // Also try finding by email for admin or other users
            user = userRepository.findByEmail(request.getUsername());
        }

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
    public ApiResponse register(@Valid @RequestBody RegisterRequest request) {
        // SECURITY: Block ADMIN role registration
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            return new ApiResponse(false, "Cannot register as admin", null);
        }

        // Validate role is USER or PROVIDER only
        String role = request.getRole() != null ? request.getRole().toUpperCase().trim() : "";
        if (!role.equals("USER") && !role.equals("PROVIDER")) {
            return new ApiResponse(false, "Role must be USER or PROVIDER", null);
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
