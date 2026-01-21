package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.entity.ServiceRequest;

import java.util.List;

public interface RequestService {

    ServiceRequest createRequest(CreateRequestDto dto, String username);
    List<ServiceRequest> getMyRequests(String username);
    ServiceRequest accept(Long id,String role,String username);
    ServiceRequest reject(Long id,String role);
    List<ServiceRequest> getPendingRequests();
    List<ServiceRequest> getAcceptedRequests(String username, String role);
    ServiceRequest cancel(Long id, String username);
    List<ServiceRequest> getAcceptedRequestsForProvider(String providerUsername,String role);

}
