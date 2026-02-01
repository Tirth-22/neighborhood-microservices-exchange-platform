package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.client.ProviderClient;
import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.dto.CreateRequestRequest;
import com.tirth.microservices.request_service.dto.ServiceRequestResponseDTO;
import com.tirth.microservices.request_service.entity.RequestStatus;
import com.tirth.microservices.request_service.entity.ServiceRequest;
import com.tirth.microservices.request_service.entity.ServiceType;
import com.tirth.microservices.request_service.event.RequestAcceptedEvent;
import com.tirth.microservices.request_service.event.RequestCompletedEvent;
import com.tirth.microservices.request_service.event.RequestRejectedEvent;
import com.tirth.microservices.request_service.exception.InvalidRequestStateException;
import com.tirth.microservices.request_service.exception.ResourceNotFoundException;
import com.tirth.microservices.request_service.exception.UnauthorizedActionException;
import com.tirth.microservices.request_service.producer.RequestEventProducer;
import com.tirth.microservices.request_service.repository.ServiceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RequestServiceImpl implements RequestService {

    private final ServiceRequestRepository repository;
    private final RequestEventProducer requestEventProducer;
    private final ProviderClient providerClient;

    private ServiceRequestResponseDTO mapToDTO(ServiceRequest request) {
        return new ServiceRequestResponseDTO(
                request.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getStatus().name(),
                request.getRequestedBy(),
                request.getAcceptedBy(),
                request.getRejectedBy()
        );
    }

    @Override
    public ServiceRequestResponseDTO createRequest(
            String username,
            CreateRequestRequest request
    ) {
        ServiceType serviceType;
        try {
            serviceType = ServiceType.valueOf(request.getServiceType().toUpperCase());
        } catch (Exception e) {
            serviceType = ServiceType.OTHER;
        }

        String providerUsername = null;
        try {
            var lookupResponse = providerClient.getProviderByService(serviceType.name());
            if (lookupResponse != null) {
                providerUsername = lookupResponse.getUsername();
            }
        } catch (Exception e) {
            System.err.println("Failed to lookup provider: " + e.getMessage());
        }

        ServiceRequest serviceRequest = ServiceRequest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requestedBy(username)
                .serviceType(serviceType)
                .status(RequestStatus.PENDING)
                .providerUsername(providerUsername)
                .build();

        ServiceRequest saved = repository.save(serviceRequest);

        // 🔥 Publish Event for Notification
        com.tirth.microservices.request_service.event.RequestCreatedEvent event = new com.tirth.microservices.request_service.event.RequestCreatedEvent(
                saved.getId(),
                saved.getRequestedBy(),
                providerUsername,
                saved.getTitle(),
                java.time.LocalDateTime.now().toString()
        );
        requestEventProducer.publishRequestCreatedEvent(event);

        // Always return DTO
        return mapToDTO(saved);
    }


    @Override
    public List<ServiceRequest> getMyRequests(String username) {
        return repository.findByRequestedBy(username);
    }


    @Override
    public ServiceRequestResponseDTO accept(Long id, String role, String username) {
        System.out.println("ACCEPTING REQUEST ID = " + id);

        ServiceRequest request = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Only provider can accept request");
        }

        boolean isActive = providerClient.isProviderActive(username);

        if (!isActive) {
            throw new UnauthorizedActionException("Provider is not active");
        }

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new InvalidRequestStateException("Request already processed");
        }

        request.setStatus(RequestStatus.ACCEPTED);
        request.setAcceptedBy(username);
//        request.setRequestedBy(null);
        request.setAcceptedAt(LocalDateTime.now());

        ServiceRequest savedRequest = repository.save(request);

        RequestAcceptedEvent event = new RequestAcceptedEvent(
                savedRequest.getId(),
                savedRequest.getRequestedBy(), // userId
                username,                      // providerId
                savedRequest.getTitle(),
                LocalDateTime.now().toString()
        );
        requestEventProducer.publishRequestAcceptedEvent(event);

        return mapToDTO(savedRequest);
    }

    @Override
    public ServiceRequest reject(Long id, String role, String username) {

        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Only provider can reject request");
        }

        ServiceRequest request = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new InvalidRequestStateException("Request already processed");
        }

        request.setStatus(RequestStatus.REJECTED);
        request.setRejectedBy(username);
        request.setRejectedAt(LocalDateTime.now());

        ServiceRequest saved =  repository.save(request);

        RequestRejectedEvent event = new RequestRejectedEvent(
                saved.getId(),
                saved.getRequestedBy(),   // userId
                username,                 // providerId
                saved.getTitle(),
                LocalDateTime.now().toString()
        );

        requestEventProducer.publishRequestRejectedEvent(event);

        return saved;
    }

    @Override
    public List<ServiceRequest> getPendingRequests(String providerUsername) {
        return repository.findByProviderUsernameAndStatus(
                providerUsername,
                RequestStatus.PENDING
        );

    }

    @Override
    public ServiceRequest cancel(Long id, String username) {

        ServiceRequest request = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new InvalidRequestStateException("Only PENDING requests can be cancelled");
        }

        if (!request.getRequestedBy().equals(username)) {
            throw new UnauthorizedActionException("You can cancel only your own request");
        }

        request.setStatus(RequestStatus.CANCELLED);
        return repository.save(request);
    }

    @Override
    public List<ServiceRequest> getAcceptedRequestsForProvider(String providerUsername, String role) {

        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only provider allowed");
        }

        return repository.findByAcceptedByAndStatus(
                providerUsername,
                RequestStatus.ACCEPTED
        );
    }

    @Override
    public ServiceRequestResponseDTO complete(Long id, String username, String role) {

        if (!"USER".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Only USER can complete request");
        }

        ServiceRequest request = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (request.getStatus() != RequestStatus.ACCEPTED) {
            throw new InvalidRequestStateException("Only ACCEPTED requests can be completed");
        }

        if (!request.getRequestedBy().equals(username)) {
            throw new UnauthorizedActionException("You can complete only your own request");
        }

        request.setStatus(RequestStatus.COMPLETED);
        request.setCompletedAt(LocalDateTime.now());

        ServiceRequest saved = repository.save(request);

        RequestCompletedEvent event = new RequestCompletedEvent(
                saved.getId(),
                saved.getRequestedBy(),
                saved.getAcceptedBy(),
                saved.getTitle(),
                saved.getCompletedAt().toString()
        );

        requestEventProducer.publishRequestCompleted(event);

        return mapToDTO(saved);
    }

    @Override
    public List<ServiceRequest> getMyCompletedRequests(String username, String role) {

        if (!"PROVIDER".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Only PROVIDER allowed");
        }

        return repository.findByAcceptedByAndStatus(
                username,
                RequestStatus.COMPLETED
        );
    }
}
