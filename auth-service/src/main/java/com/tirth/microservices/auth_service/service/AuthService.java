package com.tirth.microservices.auth_service.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tirth.microservices.auth_service.entity.User;
import com.tirth.microservices.auth_service.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * AuthService - handles authentication logic. Note: Main login logic is in
 * AuthController using BCrypt. This service can be extended for additional auth
 * features.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Validates user credentials securely using BCrypt.
     *
     * @return true if credentials are valid, false otherwise
     */
    public boolean validateCredentials(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return false;
        }
        return passwordEncoder.matches(password, user.getPassword());
    }

    /**
     * Check if user exists by email.
     */
    public boolean userExistsByEmail(String email) {
        return userRepository.findByEmail(email) != null;
    }
}
