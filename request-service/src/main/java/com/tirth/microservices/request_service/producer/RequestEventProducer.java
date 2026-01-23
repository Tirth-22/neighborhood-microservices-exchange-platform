package com.tirth.microservices.request_service.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.request_service.event.RequestAcceptedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RequestEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String TOPIC = "request.accepted";

    public void publishRequestAcceptedEvent(RequestAcceptedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, json);
            System.out.println("🚀 SENT JSON EVENT: " + json);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
