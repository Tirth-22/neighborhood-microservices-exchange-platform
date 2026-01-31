package com.tirth.microservices.request_service.controller;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import com.tirth.microservices.request_service.dto.CreateRequestRequest;
import com.tirth.microservices.request_service.dto.ServiceRequestResponseDTO;
import com.tirth.microservices.request_service.entity.RequestStatus;
import com.tirth.microservices.request_service.entity.ServiceRequest;
import com.tirth.microservices.request_service.exception.UnauthorizedActionException;
import com.tirth.microservices.request_service.security.GatewayGuard;
import com.tirth.microservices.request_service.service.RequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/requests")
public class RequestController {

    private RequestService service;
    private final GatewayGuard gatewayGuard;

    public RequestController(RequestService requestService, GatewayGuard gatewayGuard) {
        this.service = requestService;
        this.gatewayGuard = gatewayGuard;
    }

    @PostMapping
    public ServiceRequestResponseDTO createRequest(
            @RequestBody CreateRequestRequest request,
            @RequestHeader("X-User-Name") String username
    ) {
        return service.createRequest(username, request);
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
    public ServiceRequestResponseDTO accept(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader(value = "X-Gateway-Request", required = false) String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);
        if (!role.equalsIgnoreCase("PROVIDER")) {
            throw new UnauthorizedActionException("Only provider allowed");
        }

        return service.accept(id, role, username);
    }

    @PutMapping("/{id}/reject")
    public ServiceRequest reject(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader(value = "X-Gateway-Request", required = false) String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);

        if (!role.equalsIgnoreCase("PROVIDER")) {
            throw new UnauthorizedActionException("Only provider allowed");
        }

        return service.reject(id, role, username);
    }


    @GetMapping("/pending")
    public List<ServiceRequest> getPendingRequests(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Name") String username
    ) {
        if (!role.equals("PROVIDER")) {
            throw new UnauthorizedActionException("Only provider allowed");
        }
        return service.getPendingRequests(username);
    }

    @GetMapping("/accepted")
    public List<ServiceRequest> acceptedRequests(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        return service.getAcceptedRequestsForProvider(username, role);
    }

    @GetMapping("/provider/completed")
    public List<ServiceRequest> myCompletedRequests(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        return service.getMyCompletedRequests(username, role);
    }

    @PutMapping("/{id}/cancel")
    public ServiceRequest cancel(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role
    ) {
        if (!"USER".equalsIgnoreCase(role)) {
            throw new RuntimeException("Only USER can cancel request");
        }
        return service.cancel(id, username);
    }

    @GetMapping("/provider/accepted")
    public List<ServiceRequest> providerAcceptedRequests(
            @RequestHeader("X-User-Name") String providerUsername,
            @RequestHeader("X-User-Role") String role
    ) {
        return service.getAcceptedRequestsForProvider(providerUsername, role);
    }

    @PutMapping("/{id}/complete")
    public ServiceRequestResponseDTO complete(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader
    ) {
        gatewayGuard.validate(gatewayHeader);
        return service.complete(id, username, role);
    }

}

