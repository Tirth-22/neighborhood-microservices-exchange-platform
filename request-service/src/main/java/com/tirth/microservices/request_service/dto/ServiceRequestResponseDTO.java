package com.tirth.microservices.request_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ServiceRequestResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String status;
    private String requestedBy;
    private String acceptedBy;
    private String rejectedBy;
    private String providerUsername;
    private Double price;
    private String address;
    private String scheduledAt;
    private String createdAt;
}
