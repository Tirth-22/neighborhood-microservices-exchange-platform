package com.tirth.microservices.request_service.config;

import feign.RequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Feign configuration for internal service-to-service communication. Adds the
 * X-Gateway-Request header to all outgoing Feign requests so that internal
 * calls pass gateway validation on destination services.
 */
@Configuration
public class FeignConfig {

    @Value("${gateway.secret}")
    private String gatewaySecret;

    @Bean
    public RequestInterceptor gatewayHeaderInterceptor() {
        return requestTemplate -> {
            requestTemplate.header("X-Gateway-Request", gatewaySecret);
        };
    }
}
