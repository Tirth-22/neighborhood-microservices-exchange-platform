package com.tirth.microservices.provider_service.producer;

import org.springframework.beans.factory.ObjectProvider;
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

    private final ObjectProvider<KafkaTemplate<String, String>> kafkaTemplateProvider;
    private final ObjectMapper objectMapper;

    private static final String PROVIDER_REGISTERED_TOPIC = "provider.registered";
    private static final String PROVIDER_APPROVED_TOPIC = "provider.approved";
    private static final String PROVIDER_REJECTED_TOPIC = "provider.rejected";

    private void sendEvent(String topic, Object event, String label) {
        try {
            KafkaTemplate<String, String> kafkaTemplate = kafkaTemplateProvider.getIfAvailable();
            if (kafkaTemplate == null) {
                log.warn("Kafka disabled - skipping {} event: {}", label, event);
                return;
            }

            String json = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(topic, json);
            log.info("SENT {} EVENT: {}", label, json);
        } catch (Exception e) {
            log.error("Failed to send {} event", label, e);
            throw new RuntimeException(e);
        }
    }

    public void publishProviderRegisteredEvent(ProviderRegisteredEvent event) {
        sendEvent(PROVIDER_REGISTERED_TOPIC, event, "PROVIDER_REGISTERED");
    }

    public void publishProviderApprovedEvent(ProviderApprovedEvent event) {
        sendEvent(PROVIDER_APPROVED_TOPIC, event, "PROVIDER_APPROVED");
    }

    public void publishProviderRejectedEvent(ProviderRejectedEvent event) {
        sendEvent(PROVIDER_REJECTED_TOPIC, event, "PROVIDER_REJECTED");
    }
}
