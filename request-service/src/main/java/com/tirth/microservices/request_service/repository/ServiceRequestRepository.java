package com.tirth.microservices.request_service.repository;

import com.tirth.microservices.request_service.entity.ServiceRequest;
import com.tirth.microservices.request_service.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByAcceptedByAndStatus(
            String acceptedBy,
            RequestStatus status
    );

    List<ServiceRequest> findByProviderUsernameAndStatus(
            String providerUsername,
            RequestStatus status
    );

    List<ServiceRequest> findByRequestedBy(String requestedBy);
}
