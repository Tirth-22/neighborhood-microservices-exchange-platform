package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.entity.ServiceRequest;

public interface RequestService {
    ServiceRequest createRequest(CreateRequestDto dto, String username);
}
