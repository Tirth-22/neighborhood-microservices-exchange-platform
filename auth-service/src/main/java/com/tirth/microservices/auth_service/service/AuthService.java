package com.tirth.microservices.auth_service.service;

import org.springframework.stereotype.Service;
import com.tirth.microservices.auth_service.repository.UserRepository;
import com.tirth.microservices.auth_service.entity.User;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String login(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return "USER NOT FOUND";
        }

        if (user.getPassword().equals(password)) {
            return "LOGIN SUCCESS";
        }

        return "WRONG PASSWORD";
    }
}
