package com.tirth.microservices.provider_service.dto;

import lombok.Data;

@Data
public class ServiceOfferingRequest {
    private String name;
    private String description;
    private Double price;
    private String category;
}
