package com.tirth.microservices.auth_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tirth.microservices.auth_service.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findByUsername(String username);

    List<User> findAllByEmail(String email);

    List<User> findAllByUsername(String username);

    User findByEmailVerificationToken(String token);

    User findByPasswordResetToken(String token);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
}
