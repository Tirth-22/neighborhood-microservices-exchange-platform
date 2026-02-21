package com.tirth.microservices.provider_service.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tirth.microservices.provider_service.event.RequestCompletedEvent;
import com.tirth.microservices.provider_service.repository.ServiceOfferingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RatingConsumer {

    private final ServiceOfferingRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "request.completed", groupId = "provider-rating-group")
    @Transactional
    public void handleRatingUpdate(String eventJson) {
        log.info("RECEIVED KAFKA EVENT: {}", eventJson);
        try {
            RequestCompletedEvent event = objectMapper.readValue(eventJson, RequestCompletedEvent.class);

            log.info("Processing rating for Service ID: {}, Rating: {}",
                    event.getServiceOfferingId(), event.getRating());

            if (event.getServiceOfferingId() == null) {
                log.error("ABORT: ServiceOfferingId is NULL in event!");
                return;
            }

            if (event.getRating() == null) {
                log.error("ABORT: Rating is NULL in event!");
                return;
            }

            // Use atomic update to prevent race conditions
            int updatedRows = repository.updateRatingAtomically(
                    event.getServiceOfferingId(),
                    event.getRating()
            );

            if (updatedRows > 0) {
                log.info("SUCCESS: Atomically updated rating for Service ID: {}", event.getServiceOfferingId());
            } else {
                log.error("FAIL: Service offering with ID {} not found in database", event.getServiceOfferingId());
            }
        } catch (Exception e) {
            log.error("FATAL: Error parsing or processing Kafka event", e);
        }
    }
}
