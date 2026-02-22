package com.tirth.microservices.notification_service.consumer;

import java.time.LocalDateTime;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.notification_service.entity.Notification;
import com.tirth.microservices.notification_service.event.ProviderApprovedEvent;
import com.tirth.microservices.notification_service.event.ProviderRegisteredEvent;
import com.tirth.microservices.notification_service.event.ProviderRejectedEvent;
import com.tirth.microservices.notification_service.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Component
@RequiredArgsConstructor
@Slf4j
public class ProviderEventConsumer {

    private final NotificationRepository notificationRepository;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "provider.registered", groupId = "notification-group-final")
    @Transactional
    public void consumeProviderRegistered(String message) {
        try {
            ProviderRegisteredEvent event = objectMapper.readValue(message, ProviderRegisteredEvent.class);
            log.info("PROVIDER REGISTERED EVENT RECEIVED: {}", event);

            // Notify admin about new provider registration
            Notification notification = Notification.builder()
                    .userId("admin")  // Send to admin
                    .message("New provider registration: " + event.getProviderUsername() 
                            + " for " + event.getServiceType() + " service. Please review and approve/reject.")
                    .requestId(null)
                    .type("PROVIDER_REGISTERED")
                    .requestStatus("PENDING")
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);
            log.info("Admin notification saved for new provider: {}", event.getProviderUsername());

        } catch (Exception e) {
            log.error("Error processing provider.registered event", e);
        }
    }

    @KafkaListener(topics = "provider.approved", groupId = "notification-group-final")
    @Transactional
    public void consumeProviderApproved(String message) {
        try {
            ProviderApprovedEvent event = objectMapper.readValue(message, ProviderApprovedEvent.class);
            log.info("PROVIDER APPROVED EVENT RECEIVED: {}", event);

            // Notify the provider about approval
            Notification notification = Notification.builder()
                    .userId(event.getProviderUsername())
                    .message("Congratulations! Your provider registration for " + event.getServiceType() 
                            + " has been approved by " + event.getApprovedBy() + ". You can now offer services.")
                    .requestId(null)
                    .type("PROVIDER_APPROVED")
                    .requestStatus("ACTIVE")
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);
            log.info("Approval notification saved for provider: {}", event.getProviderUsername());

        } catch (Exception e) {
            log.error("Error processing provider.approved event", e);
        }
    }

    @KafkaListener(topics = "provider.rejected", groupId = "notification-group-final")
    @Transactional
    public void consumeProviderRejected(String message) {
        try {
            ProviderRejectedEvent event = objectMapper.readValue(message, ProviderRejectedEvent.class);
            log.info("PROVIDER REJECTED EVENT RECEIVED: {}", event);

            // Notify the provider about rejection
            Notification notification = Notification.builder()
                    .userId(event.getProviderUsername())
                    .message("Your provider registration for " + event.getServiceType() 
                            + " has been rejected. Please contact support for more information.")
                    .requestId(null)
                    .type("PROVIDER_REJECTED")
                    .requestStatus("INACTIVE")
                    .read(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            notificationRepository.save(notification);
            log.info("Rejection notification saved for provider: {}", event.getProviderUsername());

        } catch (Exception e) {
            log.error("Error processing provider.rejected event", e);
        }
    }
}
