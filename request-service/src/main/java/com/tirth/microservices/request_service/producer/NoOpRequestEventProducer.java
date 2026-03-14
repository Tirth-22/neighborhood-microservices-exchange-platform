package com.tirth.microservices.request_service.producer;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.tirth.microservices.request_service.event.RequestAcceptedEvent;
import com.tirth.microservices.request_service.event.RequestCancelledEvent;
import com.tirth.microservices.request_service.event.RequestCompletedEvent;
import com.tirth.microservices.request_service.event.RequestCreatedEvent;
import com.tirth.microservices.request_service.event.RequestRejectedEvent;

import lombok.extern.slf4j.Slf4j;

/**
 * No-op fallback for RequestEventProducer when Kafka is disabled.
 * Logs warnings instead of sending events.
 */
@Component
@Slf4j
@ConditionalOnProperty(name = "kafka.enabled", havingValue = "false", matchIfMissing = true)
public class NoOpRequestEventProducer extends RequestEventProducer {

    public NoOpRequestEventProducer() {
        super(null);
        log.warn("Kafka is disabled — RequestEventProducer is running in no-op mode");
    }

    @Override
    public void publishRequestCreatedEvent(RequestCreatedEvent event) {
        log.warn("Kafka disabled — skipping request.created event for: {}", event);
    }

    @Override
    public void publishRequestCancelledEvent(RequestCancelledEvent event) {
        log.warn("Kafka disabled — skipping request.cancelled event for: {}", event);
    }

    @Override
    public void publishRequestAcceptedEvent(RequestAcceptedEvent event) {
        log.warn("Kafka disabled — skipping request.accepted event for: {}", event);
    }

    @Override
    public void publishRequestRejectedEvent(RequestRejectedEvent event) {
        log.warn("Kafka disabled — skipping request.rejected event for: {}", event);
    }

    @Override
    public void publishRequestCompleted(RequestCompletedEvent event) {
        log.warn("Kafka disabled — skipping request.completed event for: {}", event);
    }
}
