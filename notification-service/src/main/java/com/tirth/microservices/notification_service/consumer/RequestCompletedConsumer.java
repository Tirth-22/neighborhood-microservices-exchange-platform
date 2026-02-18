package com.tirth.microservices.notification_service.consumer;

import java.time.LocalDateTime;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.event.RequestCompletedEvent;
import com.tirth.microservices.notification_service.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RequestCompletedConsumer {

    private final NotificationRepository notificationRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "request.completed",
            groupId = "notification-group-final"
    )
    public void consumeCompleted(String message) throws Exception {

        RequestCompletedEvent event
                = objectMapper.readValue(message, RequestCompletedEvent.class);

        // USER notification
        Notification userNotification = Notification.builder()
                .userId(event.getUserId())
                .message(
                        "Your request for " + event.getServiceName()
                        + " has been completed by " + event.getProviderId()
                )
                .requestId(event.getRequestId())
                .type("REQUEST_COMPLETED")
                .requestStatus("COMPLETED")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(userNotification);

        // PROVIDER notification (recommended)
        Notification providerNotification = Notification.builder()
                .userId(event.getProviderId())
                .message(
                        "You have successfully completed the service: "
                        + event.getServiceName()
                )
                .requestId(event.getRequestId())
                .type("REQUEST_COMPLETED")
                .requestStatus("COMPLETED")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(providerNotification);

        System.out.println("Completed notifications saved for USER and PROVIDER");
    }

}
