package com.tirth.microservices.request_service.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class CreateRequestRequest {

    private String title;
    private String serviceType; // ELECTRICIAN
    private String description;
    private String providerUsername;
    private Double price;
    private String address;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime scheduledAt;
    private Long serviceOfferingId;
    private String paymentMethod;
}
