package com.tirth.microservices.user_service.controller;

import com.tirth.microservices.user_service.dto.ApiResponse;
import com.tirth.microservices.user_service.dto.UserResponse;
import com.tirth.microservices.user_service.entity.User;
import com.tirth.microservices.user_service.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user/dashboard")
    public ApiResponse<UserResponse> dashboard(
            @RequestHeader("X-User-Name") String username,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-User-Email", required = false) String email
    ) {
        User user = userService.getOrCreateUser(username, role, email);
        System.out.println("EMAIL HEADER = " + email);

        UserResponse response = new UserResponse(user.getUsername(),user.getRole(),"Dashboard loaded successfully");

        return new ApiResponse<>(true,response,"SUCCESS");
    }
}
