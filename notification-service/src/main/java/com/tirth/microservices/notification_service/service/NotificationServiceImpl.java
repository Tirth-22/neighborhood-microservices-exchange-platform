package com.tirth.microservices.notification_service.service;

import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;

    @Override
    public List<Notification> getMyNotifications(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Notification markAsRead(Long id) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        return repository.save(notification);
    }
}
