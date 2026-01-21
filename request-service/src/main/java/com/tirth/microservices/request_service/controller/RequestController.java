package com.tirth.microservices.request_service.controller;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.entity.ServiceRequest;
import com.tirth.microservices.request_service.service.RequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
public class RequestController {

    private RequestService service;

    public RequestController(RequestService requestService) {
        this.service = requestService;
    }

    @PostMapping
    public ServiceRequest createRequest(
            @RequestBody CreateRequestDto dto,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        if (!role.equalsIgnoreCase("USER")) {
            throw new RuntimeException("Only USER can create requests");
        }

        return service.createRequest(dto, username);
    }

    @GetMapping("/my")
    public List<ServiceRequest> myRequests(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        if (!role.equalsIgnoreCase("USER")) {
            throw new RuntimeException("Only USER can create requests");
        }
        return service.getMyRequests(username);
    }

    @PutMapping("/{id}/accept")
    public ServiceRequest accept(@PathVariable Long id,
                                 @RequestHeader("X-User-Role") String role,
                                 @RequestHeader("X-User-Name") String username) {
        if (!role.equals("PROVIDER")) {
            throw new RuntimeException("Only provider allowed");
        }
        return service.accept(id, role, username);
    }

    @PutMapping("/{id}/reject")
    public ServiceRequest reject(@PathVariable Long id, @RequestHeader("X-User-Role") String role) {
        if (!role.equals("PROVIDER")) {
            throw new RuntimeException("Only provider allowed");
        }
        return service.reject(id, role);
    }

    @GetMapping("/pending")
    public List<ServiceRequest> getPendingRequests() {
//        if (!role.equals("PROVIDER")) {
//            throw new RuntimeException("Only provider allowed");
//        }
        return service.getPendingRequests();
    }

    @GetMapping("/accepted")
    public List<ServiceRequest> acceptedRequests(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        return service.getAcceptedRequests(username, role);
    }

    @PutMapping("/{id}/cancel")
    public ServiceRequest cancel(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String username
    ) {
        return service.cancel(id, username);
    }

    @GetMapping("/provider/accepted")
    public List<ServiceRequest> providerAcceptedRequests(
            @RequestHeader("X-User-Name") String providerUsername,
            @RequestHeader("X-User-Role") String role
    ) {
        return service.getAcceptedRequestsForProvider(providerUsername,role);
    }
}

