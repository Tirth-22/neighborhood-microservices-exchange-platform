package com.tirth.microservices.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;


@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        // Read allowed origin from environment variable, default to empty if not set
        String frontendUrl = System.getenv("FRONTEND_URL");
        
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Add development URLs
        corsConfig.addAllowedOrigin("http://localhost:5173");
        corsConfig.addAllowedOrigin("http://localhost");
        
        // Add production frontend URL if it exists
        if (frontendUrl != null && !frontendUrl.trim().isEmpty()) {
            corsConfig.addAllowedOrigin(frontendUrl);
        }
        corsConfig.setMaxAge(3600L);
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
