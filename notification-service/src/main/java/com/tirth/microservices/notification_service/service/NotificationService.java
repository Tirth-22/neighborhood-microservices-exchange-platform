package com.tirth.microservices.notification_service.service;

import com.tirth.microservices.notification_service.entity.Notification;

import java.util.List;

public interface NotificationService {

    List<Notification> getMyNotifications(String userId);

    Notification markAsRead(Long id);
}
