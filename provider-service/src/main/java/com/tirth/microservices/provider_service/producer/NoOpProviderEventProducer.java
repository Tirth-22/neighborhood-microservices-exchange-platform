package com.tirth.microservices.provider_service.producer;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.tirth.microservices.provider_service.event.ProviderApprovedEvent;
import com.tirth.microservices.provider_service.event.ProviderRegisteredEvent;
import com.tirth.microservices.provider_service.event.ProviderRejectedEvent;

import lombok.extern.slf4j.Slf4j;

/**
 * No-op fallback for ProviderEventProducer when Kafka is disabled.
 * Logs warnings instead of sending events.
 */
@Component
@Slf4j
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "false", matchIfMissing = true)
public class NoOpProviderEventProducer extends ProviderEventProducer {

    public NoOpProviderEventProducer() {
        super(null, null);
        log.warn("Kafka is disabled — ProviderEventProducer is running in no-op mode");
    }

    @Override
    public void publishProviderRegisteredEvent(ProviderRegisteredEvent event) {
        log.warn("Kafka disabled — skipping provider.registered event for: {}", event);
    }

    @Override
    public void publishProviderApprovedEvent(ProviderApprovedEvent event) {
        log.warn("Kafka disabled — skipping provider.approved event for: {}", event);
    }

    @Override
    public void publishProviderRejectedEvent(ProviderRejectedEvent event) {
        log.warn("Kafka disabled — skipping provider.rejected event for: {}", event);
    }
}
