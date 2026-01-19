package com.tirth.microservices.user_service.service;

import com.tirth.microservices.user_service.entity.User;

public interface UserService {

    User getOrCreateUser(String username, String role, String email);
}
