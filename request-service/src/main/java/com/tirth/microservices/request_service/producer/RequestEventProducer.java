package com.tirth.microservices.request_service.producer;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.request_service.event.RequestAcceptedEvent;
import com.tirth.microservices.request_service.event.RequestCancelledEvent;
import com.tirth.microservices.request_service.event.RequestCompletedEvent;
import com.tirth.microservices.request_service.event.RequestCreatedEvent;
import com.tirth.microservices.request_service.event.RequestRejectedEvent;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RequestEventProducer {

    private final ObjectProvider<KafkaTemplate<String, String>> kafkaTemplateProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String ACCEPT_TOPIC = "request.accepted";
    private static final String REJECT_TOPIC = "request.rejected";
    private static final String COMPLETED_TOPIC = "request.completed";
    private static final String CREATED_TOPIC = "request.created"; // ADDED
    private static final String CANCELLED_TOPIC = "request.cancelled"; // ADDED

    private void sendEvent(String topic, Object event, String label) {
        try {
            KafkaTemplate<String, String> kafkaTemplate = kafkaTemplateProvider.getIfAvailable();
            if (kafkaTemplate == null) {
                System.out.println("KAFKA DISABLED - SKIPPING " + label + " EVENT");
                return;
            }

            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, json);
            System.out.println("SENT " + label + " EVENT: " + json);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void publishRequestCreatedEvent(RequestCreatedEvent event) {
        sendEvent(CREATED_TOPIC, event, "CREATED");
    }

    public void publishRequestCancelledEvent(RequestCancelledEvent event) {
        sendEvent(CANCELLED_TOPIC, event, "CANCELLED");
    }

    public void publishRequestAcceptedEvent(RequestAcceptedEvent event) {
        sendEvent(ACCEPT_TOPIC, event, "ACCEPTED");
    }

    public void publishRequestRejectedEvent(RequestRejectedEvent event) {
        sendEvent(REJECT_TOPIC, event, "REJECTED");
    }

    public void publishRequestCompleted(RequestCompletedEvent event) {
        sendEvent(COMPLETED_TOPIC, event, "COMPLETED");
    }
}
