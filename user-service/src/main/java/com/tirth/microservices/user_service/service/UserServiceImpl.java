package com.tirth.microservices.user_service.service;

import com.tirth.microservices.user_service.entity.User;
import com.tirth.microservices.user_service.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService{

    private UserRepository repository;

    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User getOrCreateUser(String username, String role,String email) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email missing in JWT");
        }

        return repository.findByUsername(username)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(username);
                    newUser.setRole(role);
                    newUser.setEmail(email);
                    return repository.save(newUser);
                });
    }
}
