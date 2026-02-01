package com.tirth.microservices.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private boolean success;
    private String message;
    private String token;
}