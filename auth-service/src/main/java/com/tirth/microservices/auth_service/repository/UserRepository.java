package com.tirth.microservices.auth_service.repository;

import com.tirth.microservices.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);
    List<User> findAllByEmail(String email);
    List<User> findAllByUsername(String username);
}
