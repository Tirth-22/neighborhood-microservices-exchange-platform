package com.tirth.microservices.notification_service.service;

import com.tirth.microservices.notification_service.dto.NotificationResponseDTO;
import com.tirth.microservices.notification_service.entity.Notification;
import org.springframework.data.domain.Page;

import java.util.List;

public interface NotificationService {

    Notification markAsRead(Long id, String userId);
    long getUnreadCount(String userId);
    void markAllAsRead(String userId);
    Page<NotificationResponseDTO> getMyNotifications(
            String userId,
            int page,
            int size
    );
}
