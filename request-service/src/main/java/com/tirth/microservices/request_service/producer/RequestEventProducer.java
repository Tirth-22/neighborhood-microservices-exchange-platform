package com.tirth.microservices.request_service.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.request_service.event.RequestAcceptedEvent;
import com.tirth.microservices.request_service.event.RequestCancelledEvent;
import com.tirth.microservices.request_service.event.RequestCompletedEvent;
import com.tirth.microservices.request_service.event.RequestRejectedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RequestEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String ACCEPT_TOPIC = "request.accepted";
    private static final String REJECT_TOPIC = "request.rejected";
    private static final String COMPLETED_TOPIC = "request.completed";
    private static final String CREATED_TOPIC = "request.created";
    private static final String CANCELLED_TOPIC = "request.cancelled";

    public void publishRequestCreatedEvent(com.tirth.microservices.request_service.event.RequestCreatedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(CREATED_TOPIC, json);
            System.out.println("SENT CREATED EVENT: " + json);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void publishRequestAcceptedEvent(RequestAcceptedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ACCEPT_TOPIC, json);
            System.out.println(" SENT JSON EVENT: " + json);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void publishRequestRejectedEvent(RequestRejectedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(REJECT_TOPIC, json);
            System.out.println("SENT REJECT EVENT: " + json);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void publishRequestCompleted(RequestCompletedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(COMPLETED_TOPIC, json);
            System.out.println(" SENT COMPLETED EVENT: " + json);
        }catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void publishRequestCancelledEvent(RequestCancelledEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(CANCELLED_TOPIC, json);
            System.out.println("SENT CANCELLED EVENT: " + json);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
