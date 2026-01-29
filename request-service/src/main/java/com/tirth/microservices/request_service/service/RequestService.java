package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.dto.ServiceRequestResponseDTO;
import com.tirth.microservices.request_service.entity.ServiceRequest;

import java.util.List;

public interface RequestService {

    ServiceRequestResponseDTO createRequest(CreateRequestDto dto, String username, String role);
    ServiceRequestResponseDTO accept(Long id, String role, String username);
    ServiceRequest reject(Long id, String role, String username);
    ServiceRequest cancel(Long id, String username);
    ServiceRequestResponseDTO complete(Long id, String username, String role);

    List<ServiceRequest> getMyRequests(String username);
    List<ServiceRequest> getPendingRequests();
    List<ServiceRequest> getMyCompletedRequests(String providerUsername, String role);
    List<ServiceRequest> getAcceptedRequestsForProvider(String providerUsername, String role);

}
