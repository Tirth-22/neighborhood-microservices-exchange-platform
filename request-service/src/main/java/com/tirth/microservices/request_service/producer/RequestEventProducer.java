package com.tirth.microservices.request_service.producer;

import com.tirth.microservices.request_service.event.RequestAcceptedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RequestEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String TOPIC = "request.accepted";

    public void publishRequestAcceptedEvent(RequestAcceptedEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }
}
