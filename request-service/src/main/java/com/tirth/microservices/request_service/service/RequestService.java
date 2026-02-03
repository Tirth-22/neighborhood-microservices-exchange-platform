package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.dto.CreateRequestRequest;
import com.tirth.microservices.request_service.dto.ServiceRequestResponseDTO;

import java.util.List;

public interface RequestService {

    // SINGLE create method
    ServiceRequestResponseDTO createRequest(
            String username,
            CreateRequestRequest request);

    ServiceRequestResponseDTO accept(Long id, String role, String username);

    ServiceRequestResponseDTO reject(Long id, String role, String username);

    ServiceRequestResponseDTO cancel(Long id, String username);

    ServiceRequestResponseDTO complete(Long id, String username, String role);

    List<ServiceRequestResponseDTO> getMyRequests(String username);

    List<ServiceRequestResponseDTO> getPendingRequests(String providerUsername);

    List<ServiceRequestResponseDTO> getMyCompletedRequests(String providerUsername, String role);

    List<ServiceRequestResponseDTO> getAcceptedRequestsForProvider(String providerUsername, String role);
}
