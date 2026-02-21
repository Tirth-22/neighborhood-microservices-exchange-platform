package com.tirth.microservices.request_service.security;

import org.springframework.beans.factory.annotation.Value;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.stereotype.Component;

@Component
public class FeignGatewayInterceptor implements RequestInterceptor {

    @Value("${gateway.secret}")
    private String gatewaySecret;

    @Override
    public void apply(RequestTemplate template) {

        String url = template.url();

        if (url.contains("/v3/api-docs") || url.contains("/swagger-ui")) {
            return;
        }

        template.header("X-Gateway-Request", gatewaySecret);
    }
}
