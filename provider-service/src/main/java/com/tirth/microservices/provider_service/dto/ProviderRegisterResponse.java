package com.tirth.microservices.provider_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProviderRegisterResponse {

    private String status; // "Pending Approval"

}
