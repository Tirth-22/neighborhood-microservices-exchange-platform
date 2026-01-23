package com.tirth.microservices.notification_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(
            topics = "request.accepted",
            groupId = "notification-group-final"
    )
    public void consume(String message) throws Exception {

        System.out.println("RAW JSON RECEIVED: " + message);

        RequestAcceptedEvent event =
                new ObjectMapper().readValue(message, RequestAcceptedEvent.class);

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .message(
                        "Your request for " + event.getServiceName() +
                                " has been accepted by " + event.getProviderId()
                )
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

}
