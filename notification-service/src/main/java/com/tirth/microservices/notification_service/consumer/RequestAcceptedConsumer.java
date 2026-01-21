package com.tirth.microservices.notification_service.consumer;

import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.event.RequestAcceptedEvent;
import com.tirth.microservices.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class RequestAcceptedConsumer {

    private final NotificationRepository notificationRepository;

    @KafkaListener(
            topics = "request.accepted",
            groupId = "notification-group"
    )
    public void consume(RequestAcceptedEvent event) {

        String message = "Your request for "
                + event.getServiceName()
                + " has been accepted by "
                + event.getProviderId();

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .message(message)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }
}
