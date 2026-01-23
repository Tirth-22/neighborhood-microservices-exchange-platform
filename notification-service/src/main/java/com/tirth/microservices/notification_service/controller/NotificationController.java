package com.tirth.microservices.notification_service.controller;

import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/my")
    public List<Notification> myNotifications(
            @RequestHeader("X-User-Name") String userId
    ) {
        return service.getMyNotifications(userId);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return service.markAsRead(id);
    }
}
