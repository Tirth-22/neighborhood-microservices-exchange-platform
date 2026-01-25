package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.dto.ServiceRequestResponseDTO;
import com.tirth.microservices.request_service.entity.RequestStatus;
import com.tirth.microservices.request_service.entity.ServiceRequest;
import com.tirth.microservices.request_service.event.RequestAcceptedEvent;
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
    public ServiceRequestResponseDTO createRequest(CreateRequestDto dto, String username) {

        ServiceRequest request = new ServiceRequest();
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setRequestedBy(username);
        request.setStatus(RequestStatus.PENDING);

        ServiceRequest saved = repository.save(request);

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

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new InvalidRequestStateException("Request already processed");
        }

        request.setStatus(RequestStatus.ACCEPTED);
        request.setAcceptedBy(username);

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

        RequestRejectedEvent event = new RequestRejectedEvent(
                request.getId(),
                request.getRequestedBy(),
                username,
                request.getTitle(),
                LocalDateTime.now().toString()
        );

        requestEventProducer.publishRequestRejectedEvent(event);

        request.setStatus(RequestStatus.REJECTED);
        request.setRejectedBy(username);
        request.setAcceptedBy(null);
        return repository.save(request);
    }

    @Override
    public List<ServiceRequest> getPendingRequests() {
        return repository.findByStatus(RequestStatus.PENDING);
    }

    @Override
    public ServiceRequest cancel(Long id, String username) {

        ServiceRequest request = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (!request.getStatus().equals(RequestStatus.PENDING)) {
            throw new RuntimeException("Only PENDING requests can be cancelled");
        }

        if (!request.getRequestedBy().equals(username)) {
            throw new RuntimeException("You can cancel only your own request");
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
}
