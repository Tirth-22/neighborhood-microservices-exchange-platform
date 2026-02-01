package com.tirth.microservices.notification_service.service;

import com.tirth.microservices.notification_service.dto.NotificationResponseDTO;
import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;

    private NotificationResponseDTO map(Notification n) {
        return new NotificationResponseDTO(
                n.getId(),
                n.getMessage(),
                n.isRead(),
                n.getCreatedAt(),
                n.getRequestId(),
                n.getType()
        );
    }

    @Override
    public Notification markAsRead(Long id, String userId) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);
        return repository.save(notification);
    }

    @Override
    public long getUnreadCount(String userId) {
        return repository.countByUserIdAndReadFalse(userId);
    }

    @Override
    public Page<NotificationResponseDTO> getMyNotifications(
            String userId,
            int page,
            int size
    ) {
        return repository
                .findByUserIdOrderByCreatedAtDesc(
                        userId,
                        PageRequest.of(page, size, Sort.by("createdAt").descending())
                )
                .map(this::map);
    }

    @Override
    @Transactional
    public void markAllAsRead(String userId) {
        repository.markAllAsRead(userId);
    }

}