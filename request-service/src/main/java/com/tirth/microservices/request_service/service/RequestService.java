package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.dto.CreateRequestRequest;
import com.tirth.microservices.request_service.dto.ServiceRequestResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RequestService {

    // SINGLE create method
    ServiceRequestResponseDTO createRequest(
            String username,
            CreateRequestRequest request);

    ServiceRequestResponseDTO accept(Long id, String role, String username);

    ServiceRequestResponseDTO reject(Long id, String role, String username);

    ServiceRequestResponseDTO cancel(Long id, String username, String role);

    ServiceRequestResponseDTO complete(Long id, String username, String role, Double rating);

    List<ServiceRequestResponseDTO> getMyRequests(String username);

    Page<ServiceRequestResponseDTO> getMyRequests(String username, Pageable pageable);

    List<ServiceRequestResponseDTO> getPendingRequests(String providerUsername);

    Page<ServiceRequestResponseDTO> getPendingRequests(String providerUsername, Pageable pageable);

    List<ServiceRequestResponseDTO> getMyCompletedRequests(String providerUsername, String role);

    Page<ServiceRequestResponseDTO> getMyCompletedRequests(String providerUsername, String role, Pageable pageable);

    List<ServiceRequestResponseDTO> getAcceptedRequestsForProvider(String providerUsername, String role);

    Page<ServiceRequestResponseDTO> getAcceptedRequestsForProvider(String providerUsername, String role, Pageable pageable);
}
