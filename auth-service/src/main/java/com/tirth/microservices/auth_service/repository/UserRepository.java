package com.tirth.microservices.auth_service.repository;

import com.tirth.microservices.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
