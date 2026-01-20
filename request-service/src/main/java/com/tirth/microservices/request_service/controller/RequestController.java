package com.tirth.microservices.request_service.controller;

import com.tirth.microservices.request_service.dto.CreateRequestDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/requests")
public class RequestController {

    @PostMapping
    public String createRequest(
            @RequestBody CreateRequestDto dto,
            @RequestHeader("X-User-Name") String username
    ) {
        return "Request received from user: " + username;
    }
}
