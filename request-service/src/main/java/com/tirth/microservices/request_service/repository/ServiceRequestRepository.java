package com.tirth.microservices.request_service.repository;

import com.tirth.microservices.request_service.entity.RequestStatus;
import com.tirth.microservices.request_service.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByRequestedBy(String requestedBy);
    List<ServiceRequest> findByStatus(RequestStatus status);
    List<ServiceRequest> findByAcceptedBy(String acceptedBy);

}
