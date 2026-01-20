package com.tirth.microservices.request_service.dto;

import lombok.Data;

@Data
public class CreateRequestDto {

    private String title;
    private String description;
}
