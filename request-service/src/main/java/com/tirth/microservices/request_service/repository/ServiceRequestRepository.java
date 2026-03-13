package com.tirth.microservices.request_service.repository;

import com.tirth.microservices.request_service.entity.ServiceRequest;
import com.tirth.microservices.request_service.entity.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByAcceptedByAndStatus(
            String acceptedBy,
            RequestStatus status
    );

    Page<ServiceRequest> findByAcceptedByAndStatusOrderByCreatedAtDesc(
            String acceptedBy,
            RequestStatus status,
            Pageable pageable
    );

    List<ServiceRequest> findByProviderUsernameAndStatus(
            String providerUsername,
            RequestStatus status
    );

    Page<ServiceRequest> findByProviderUsernameAndStatusOrderByCreatedAtDesc(
            String providerUsername,
            RequestStatus status,
            Pageable pageable
    );

    List<ServiceRequest> findByRequestedBy(String requestedBy);

    Page<ServiceRequest> findByRequestedByOrderByCreatedAtDesc(String requestedBy, Pageable pageable);
}
