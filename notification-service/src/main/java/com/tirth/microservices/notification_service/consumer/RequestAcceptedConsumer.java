package com.tirth.microservices.notification_service.consumer;

import java.time.LocalDateTime;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.event.RequestCompletedEvent;
import com.tirth.microservices.notification_service.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RequestAcceptedConsumer {

    private final NotificationRepository notificationRepository;

    @KafkaListener(topics = "request.accepted", groupId = "notification-group-final")
    @Transactional
    public void consumeAccepted(String message) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        com.tirth.microservices.notification_service.event.RequestAcceptedEvent event = mapper.readValue(
                message, com.tirth.microservices.notification_service.event.RequestAcceptedEvent.class);

        System.out.println("ACCEPT EVENT RECEIVED: " + event);

        // Mark the original REQUEST_CREATED notification as read (hide Accept/Reject buttons)
        notificationRepository.markRequestCreatedAsRead(event.getRequestId());
        System.out.println("Marked REQUEST_CREATED notification as read for requestId = " + event.getRequestId());

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .message(
                        "Your request for " + event.getServiceName()
                        + " has been accepted by " + event.getProviderId())
                .requestId(event.getRequestId())
                .type("REQUEST_ACCEPTED")
                .requestStatus("ACCEPTED")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        System.out.println("Accepted notification saved for userId = " + event.getUserId());
    }

    @Transactional
    @KafkaListener(topics = "request.rejected", groupId = "notification-group-final")
    public void consumeRejected(String message) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        com.tirth.microservices.notification_service.event.RequestRejectedEvent event = mapper.readValue(
                message, com.tirth.microservices.notification_service.event.RequestRejectedEvent.class);

        System.out.println("REJECT EVENT RECEIVED: " + event);

        // Mark the original REQUEST_CREATED notification as read (hide Accept/Reject buttons)
        notificationRepository.markRequestCreatedAsRead(event.getRequestId());
        System.out.println("Marked REQUEST_CREATED notification as read for requestId = " + event.getRequestId());

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .message(
                        "Your request for " + event.getServiceName()
                        + " was rejected by " + event.getProviderId())
                .requestId(event.getRequestId())
                .type("REQUEST_REJECTED")
                .requestStatus("REJECTED")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        System.out.println("Rejected notification saved for userId = " + event.getUserId());
    }

    @Transactional
    @KafkaListener(topics = "request.completed", groupId = "notification-group-final")
    public void consumeCompleted(String message) throws Exception {

        ObjectMapper mapper = new ObjectMapper();

        RequestCompletedEvent event = mapper.readValue(message, RequestCompletedEvent.class);

        System.out.println("COMPLETED EVENT RECEIVED: " + event);

        Notification notification = Notification.builder()
                .userId(event.getProviderId())
                .message(
                        "User completed request for " + event.getServiceName())
                .requestId(event.getRequestId())
                .type("REQUEST_COMPLETED")
                .requestStatus("COMPLETED")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    @Transactional

    @KafkaListener(topics = "request.created", groupId = "notification-group-final")
    public void consumeCreated(String message) throws Exception {

        ObjectMapper mapper = new ObjectMapper();
        com.tirth.microservices.notification_service.event.RequestCreatedEvent event = mapper.readValue(message,
                com.tirth.microservices.notification_service.event.RequestCreatedEvent.class);

        System.out.println("CREATED EVENT RECEIVED: " + event);

        Notification notification = Notification.builder()
                .userId(event.getProviderUsername()) // Send to Provider
                .message(
                        "New Request Received: " + event.getTitle()
                        + " from " + event.getRequestedBy())
                .requestId(event.getRequestId())
                .type("REQUEST_CREATED")
                .requestStatus("PENDING")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
        System.out.println("Created notification saved for provider = " + event.getProviderUsername());
    }

}
