package com.tirth.microservices.notification_service.repository;

import com.tirth.microservices.notification_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
