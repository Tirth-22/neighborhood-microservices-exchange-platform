package com.tirth.microservices.request_service.dto;

import lombok.Data;

@Data
public class CreateRequestRequest {

    private String title;
    private String serviceType;   // ELECTRICIAN
    private String description;
}
