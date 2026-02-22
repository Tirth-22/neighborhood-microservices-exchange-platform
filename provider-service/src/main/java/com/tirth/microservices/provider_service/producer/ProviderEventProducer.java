package com.tirth.microservices.provider_service.producer;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.provider_service.event.ProviderApprovedEvent;
import com.tirth.microservices.provider_service.event.ProviderRegisteredEvent;
import com.tirth.microservices.provider_service.event.ProviderRejectedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProviderEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    private static final String PROVIDER_REGISTERED_TOPIC = "provider.registered";
    private static final String PROVIDER_APPROVED_TOPIC = "provider.approved";
    private static final String PROVIDER_REJECTED_TOPIC = "provider.rejected";

    public void publishProviderRegisteredEvent(ProviderRegisteredEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(PROVIDER_REGISTERED_TOPIC, json);
            log.info("SENT PROVIDER_REGISTERED EVENT: {}", json);
        } catch (Exception e) {
            log.error("Failed to send provider registered event", e);
            throw new RuntimeException(e);
        }
    }

    public void publishProviderApprovedEvent(ProviderApprovedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(PROVIDER_APPROVED_TOPIC, json);
            log.info("SENT PROVIDER_APPROVED EVENT: {}", json);
        } catch (Exception e) {
            log.error("Failed to send provider approved event", e);
            throw new RuntimeException(e);
        }
    }

    public void publishProviderRejectedEvent(ProviderRejectedEvent event) {
        try {
            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(PROVIDER_REJECTED_TOPIC, json);
            log.info("SENT PROVIDER_REJECTED EVENT: {}", json);
        } catch (Exception e) {
            log.error("Failed to send provider rejected event", e);
            throw new RuntimeException(e);
        }
    }
}
