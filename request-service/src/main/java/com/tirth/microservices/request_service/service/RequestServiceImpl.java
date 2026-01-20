package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.entity.ServiceRequest;
import com.tirth.microservices.request_service.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;

@Service
public class RequestServiceImpl implements RequestService {

    private ServiceRequestRepository repository;

    public RequestServiceImpl(ServiceRequestRepository repository) {
        this.repository = repository;
    }

    @Override
    public ServiceRequest createRequest(CreateRequestDto dto, String username){

        ServiceRequest request = new ServiceRequest();
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        request.setRequestedBy(username);
        request.setStatus("PENDING");

        return repository.save(request);
    }
}
