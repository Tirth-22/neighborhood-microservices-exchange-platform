package com.tirth.microservices.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AccountProfileResponse {

    private String username;
    private String email;
    private String role;
    private boolean emailVerified;
    private boolean active;
}
