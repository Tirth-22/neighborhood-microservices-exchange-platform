package com.tirth.microservices.notification_service.controller;

import com.tirth.microservices.notification_service.dto.NotificationResponseDTO;
import com.tirth.microservices.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping("/my")
    public Page<NotificationResponseDTO> myNotifications(
            @RequestHeader("X-User-Name") String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getMyNotifications(userId, page, size);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @RequestHeader("X-User-Name") String userId
    ) {
        service.markAsRead(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(
            @RequestHeader("X-User-Name") String userId
    ) {
        return Map.of("count", service.getUnreadCount(userId));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @RequestHeader("X-User-Name") String userId
    ) {
        service.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}
