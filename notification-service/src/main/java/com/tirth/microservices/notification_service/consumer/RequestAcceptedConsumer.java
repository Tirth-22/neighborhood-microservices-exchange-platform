package com.tirth.microservices.notification_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.event.RequestAcceptedEvent;
import com.tirth.microservices.notification_service.event.RequestCompletedEvent;
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

    @KafkaListener(
            topics = "request.completed",
            groupId = "notification-group-final"
    )
    public void consumeCompleted(String message) throws Exception {

        ObjectMapper mapper = new ObjectMapper();

        RequestCompletedEvent event =
                mapper.readValue(message, RequestCompletedEvent.class);

        System.out.println("COMPLETED EVENT RECEIVED: " + event);

        Notification notification = Notification.builder()
                .userId(event.getProviderId())
                .message(
                        "User completed request for " + event.getServiceName()
                )
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }


}
