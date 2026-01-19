package com.tirth.microservices.auth_service.controller;

import com.tirth.microservices.auth_service.dto.LoginRequest;
import com.tirth.microservices.auth_service.dto.LoginResponse;
import com.tirth.microservices.auth_service.dto.RegisterRequest;
import com.tirth.microservices.auth_service.entity.User;
import com.tirth.microservices.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.tirth.microservices.auth_service.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;


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
        User user = userRepository.findByUsername(request.getUsername());

        if (user == null) {
            return new  LoginResponse(false, "User not found",null);
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new  LoginResponse(true, "Wrong password",null);
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole(),
                user.getEmail()
        );

        return new LoginResponse(true, user.getRole(),token);
    }

    @PostMapping("/auth/register")
    public String register(@RequestBody RegisterRequest request) {
        User existingUser = userRepository.findByUsername(request.getUsername());

        if (existingUser != null) {
            return "User already exists";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        userRepository.save(user);

        return "USER REGISTERED";
    }


}
