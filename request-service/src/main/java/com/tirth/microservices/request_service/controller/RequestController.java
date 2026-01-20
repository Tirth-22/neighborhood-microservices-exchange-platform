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
            @RequestHeader("X-User-Name") String username
    ) {
//        System.out.println("CONTROLLER HIT: " + username);
        return service.createRequest(dto,username);
    }

    @GetMapping("/my")
    public List<ServiceRequest> myRequests(
            @RequestHeader("X-User-Name") String username
    ) {
        return service.getMyRequest(username);
    }

    @PutMapping("/{id}/accept")
    public ServiceRequest accept(@PathVariable Long id, @RequestHeader("X-User-Role") String role) {
        return service.accept(id,role);
    }

    @PutMapping("/{id}/reject")
    public ServiceRequest reject(@PathVariable Long id,@RequestHeader("X-User-Role") String role) {
        return service.reject(id,role);
    }
}

