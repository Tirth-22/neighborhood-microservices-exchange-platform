package com.tirth.microservices.api_gateway;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    private void addNormalizedOrigin(CorsConfiguration corsConfig, String origin) {
        if (origin == null) {
            return;
        }

        String normalized = origin.trim();
        if (normalized.isEmpty()) {
            return;
        }

        // Browser Origin header never contains trailing slash.
        if (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }

        corsConfig.addAllowedOrigin(normalized);
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        // Read allowed origin from environment variable, default to empty if not set
        String frontendUrl = System.getenv("FRONTEND_URL");

        CorsConfiguration corsConfig = new CorsConfiguration();

        // Add development URLs
        corsConfig.addAllowedOrigin("http://localhost:5173");
        corsConfig.addAllowedOrigin("http://localhost");

        // Add production frontend URL if it exists
        addNormalizedOrigin(corsConfig, frontendUrl);

        // Allow Vercel preview/prod domains used by this frontend.
        corsConfig.addAllowedOriginPattern("https://*.vercel.app");

        corsConfig.setMaxAge(3600L);
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
