package com.tirth.microservices.request_service.service;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.entity.RequestStatus;
import com.tirth.microservices.request_service.entity.ServiceRequest;
import com.tirth.microservices.request_service.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
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
        request.setStatus(RequestStatus.PENDING);

        return repository.save(request);
    }

    @Override
    public List<ServiceRequest> getMyRequests(String username) {
        return repository.findByRequestedBy(username);
    }

    @Override
    public ServiceRequest accept(Long id,String role,String username){
        ServiceRequest request = repository.findById(id).orElseThrow(() -> new RuntimeException("request not found"));

        if (!"PROVIDER".equals(role)) {
            throw new RuntimeException("Only provider can accept request");
        }

        if(!request.getStatus().equals(RequestStatus.PENDING)){
            throw new RuntimeException("request already accepted");
        }

        request.setStatus(RequestStatus.ACCEPTED);
        request.setAcceptedBy(username);
        return repository.save(request);
    }

    @Override
    public ServiceRequest reject(Long id,String role){
        ServiceRequest request = repository.findById(id).orElseThrow(() -> new RuntimeException("request not found"));

        if(!request.getStatus().equals(RequestStatus.PENDING)){
            throw new RuntimeException("request already accepted");
        }

        request.setStatus(RequestStatus.REJECTED);
        return repository.save(request);
    }

    @Override
    public List<ServiceRequest> getPendingRequests(){
        return repository.findByStatus(RequestStatus.PENDING);
    }

    @Override
    public List<ServiceRequest> getAcceptedRequests(String username, String role){
        if(!role.equalsIgnoreCase(RequestStatus.PENDING.toString())){
            throw new RuntimeException("Only provider can accept request");
        }

        return repository.findByRequestedBy(username);
    }

    @Override
    public ServiceRequest cancel(Long id, String username){

    }
}
