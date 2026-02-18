package com.tirth.microservices.notification_service.consumer;

import java.time.LocalDateTime;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.event.RequestCancelledEvent;
import com.tirth.microservices.notification_service.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RequestCancelledConsumer {

    private final NotificationRepository notificationRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "request.cancelled", groupId = "notification-group-final")
    @Transactional
    public void consumeCancelled(String message) throws Exception {

        RequestCancelledEvent event = objectMapper.readValue(message, RequestCancelledEvent.class);

        System.out.println("CANCELLED EVENT RECEIVED: " + event);

        // Mark the original REQUEST_CREATED notification as read and set requestStatus to CANCELLED (hide Accept/Reject)
        notificationRepository.markRequestCreatedAsCancelled(event.getRequestId(), event.getProviderUsername());
        System.out.println("Marked REQUEST_CREATED as cancelled for requestId = " + event.getRequestId() + ", provider = " + event.getProviderUsername());

        // Notify the PROVIDER about the cancelled request
        Notification notification = Notification.builder()
                .userId(event.getProviderUsername())
                .message(
                        "Request for \"" + event.getTitle()
                        + "\" has been cancelled by " + event.getRequestedBy())
                .requestId(event.getRequestId())
                .type("REQUEST_CANCELLED")
                .requestStatus("CANCELLED")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        System.out.println("Cancelled notification saved for provider = " + event.getProviderUsername());
    }
}
