package com.tirth.microservices.request_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.tirth.microservices.request_service.dto.CreateRequestRequest;
import com.tirth.microservices.request_service.dto.ServiceRequestResponseDTO;
import com.tirth.microservices.request_service.exception.UnauthorizedActionException;
import com.tirth.microservices.request_service.security.GatewayGuard;
import com.tirth.microservices.request_service.service.RequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/requests")
public class RequestController {

    private final RequestService service;
    private final GatewayGuard gatewayGuard;

    public RequestController(RequestService requestService, GatewayGuard gatewayGuard) {
        this.service = requestService;
        this.gatewayGuard = gatewayGuard;
    }

    @PostMapping
    public ServiceRequestResponseDTO createRequest(
            @Valid @RequestBody CreateRequestRequest request,
            @RequestHeader("X-User-Name") String username) {
        return service.createRequest(username, request);
    }

    @GetMapping("/my")
    public List<ServiceRequestResponseDTO> myRequests(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role) {
        if (!role.equalsIgnoreCase("USER") && !role.equalsIgnoreCase("PROVIDER")) {
            throw new RuntimeException("Only USER/PROVIDER can view their requests");
        }
        return service.getMyRequests(username);
    }

    @GetMapping("/my/paged")
    public Page<ServiceRequestResponseDTO> myRequestsPaged(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        if (!role.equalsIgnoreCase("USER") && !role.equalsIgnoreCase("PROVIDER")) {
            throw new RuntimeException("Only USER/PROVIDER can view their requests");
        }

        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getMyRequests(username, pageable);
    }

    @PutMapping("/{id}/accept")
    public ServiceRequestResponseDTO accept(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader(value = "X-Gateway-Request", required = false) String gatewayHeader) {
        gatewayGuard.validate(gatewayHeader);
        if (!role.equalsIgnoreCase("PROVIDER")) {
            throw new UnauthorizedActionException("Only provider allowed");
        }

        return service.accept(id, role, username);
    }

    @PutMapping("/{id}/reject")
    public ServiceRequestResponseDTO reject(
            @PathVariable Long id,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader(value = "X-Gateway-Request", required = false) String gatewayHeader) {
        gatewayGuard.validate(gatewayHeader);

        if (!role.equalsIgnoreCase("PROVIDER")) {
            throw new UnauthorizedActionException("Only provider allowed");
        }

        return service.reject(id, role, username);
    }

    @GetMapping("/pending")
    public List<ServiceRequestResponseDTO> getPendingRequests(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Name") String username) {
        if (!role.equals("PROVIDER")) {
            throw new UnauthorizedActionException("Only provider allowed");
        }
        return service.getPendingRequests(username);
    }

    @GetMapping("/pending/paged")
    public Page<ServiceRequestResponseDTO> getPendingRequestsPaged(
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Name") String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        if (!role.equalsIgnoreCase("PROVIDER")) {
            throw new UnauthorizedActionException("Only provider allowed");
        }
        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getPendingRequests(username, pageable);
    }

    @GetMapping("/accepted")
    public List<ServiceRequestResponseDTO> acceptedRequests(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role) {
        return service.getAcceptedRequestsForProvider(username, role);
    }

    @GetMapping("/accepted/paged")
    public Page<ServiceRequestResponseDTO> acceptedRequestsPaged(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getAcceptedRequestsForProvider(username, role, pageable);
    }

    @GetMapping("/provider/completed")
    public List<ServiceRequestResponseDTO> myCompletedRequests(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role) {
        return service.getMyCompletedRequests(username, role);
    }

    @GetMapping("/provider/completed/paged")
    public Page<ServiceRequestResponseDTO> myCompletedRequestsPaged(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Sort sort = "asc".equalsIgnoreCase(sortDir)
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return service.getMyCompletedRequests(username, role, pageable);
    }

    @PutMapping("/{id}/cancel")
    public ServiceRequestResponseDTO cancel(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role) {
//        if (!"USER".equalsIgnoreCase(role) && !"PROVIDER".equalsIgnoreCase(role)) {
//            throw new RuntimeException("Only USER/PROVIDER can cancel request");
//        }
        if (!"USER".equalsIgnoreCase(role)) {
            throw new UnauthorizedActionException("Only USER can cancel request");
        }
        return service.cancel(id, username, role);
    }

    @GetMapping("/provider/accepted")
    public List<ServiceRequestResponseDTO> providerAcceptedRequests(
            @RequestHeader("X-User-Name") String providerUsername,
            @RequestHeader("X-User-Role") String role) {
        return service.getAcceptedRequestsForProvider(providerUsername, role);
    }

    @PutMapping("/{id}/complete")
    public ServiceRequestResponseDTO complete(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-Gateway-Request") String gatewayHeader,
            @RequestParam Double rating) {
        gatewayGuard.validate(gatewayHeader);
        return service.complete(id, username, role, rating);
    }

}
