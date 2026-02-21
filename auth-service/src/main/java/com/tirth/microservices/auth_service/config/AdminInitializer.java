package com.tirth.microservices.auth_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.tirth.microservices.auth_service.entity.User;
import com.tirth.microservices.auth_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.username:admin}")
    private String adminUsername;

    @Value("${admin.email:admin@neighborhood.com}")
    private String adminEmail;

    @Value("${admin.password:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        // Check if admin already exists
        if (userRepository.findByUsername(adminUsername) == null
                && userRepository.findByEmail(adminEmail) == null) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            log.info("Admin user created successfully: {}", adminUsername);
        } else {
            log.info("Admin user already exists, skipping creation");
        }
    }
}
