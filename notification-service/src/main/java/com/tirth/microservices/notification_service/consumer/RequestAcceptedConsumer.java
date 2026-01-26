package com.tirth.microservices.notification_service.consumer;

import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.event.RequestAcceptedEvent;
import com.tirth.microservices.notification_service.event.RequestRejectedEvent;
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
            groupId = "notification-group-final"
    )
    public void consumeAccepted(RequestAcceptedEvent event) {

        System.out.println("ACCEPT EVENT RECEIVED: " + event);

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

        System.out.println("Accepted notification saved for userId = " + event.getUserId());
    }

    @KafkaListener(
            topics = "request.rejected",
            groupId = "notification-group-final"
    )
    public void consumeRejected(RequestRejectedEvent event) {

        System.out.println("REJECT EVENT RECEIVED: " + event);

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .message(
                        "Your request for " + event.getServiceName() +
                                " was rejected by " + event.getProviderId()
                )
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        System.out.println("Rejected notification saved for userId = " + event.getUserId());
    }
}
