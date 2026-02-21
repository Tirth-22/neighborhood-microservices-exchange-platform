package com.tirth.microservices.api_gateway.filter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import com.tirth.microservices.api_gateway.util.JwtUtil;

import reactor.core.publisher.Mono;

@Component
public class JwtFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    @Value("${gateway.secret}")
    private String gatewaySecret;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        // PUBLIC ENDPOINTS (NO JWT)
        if (path.startsWith("/auth")) {
            return chain.filter(exchange);
        }

        // READ AUTH HEADER
        String authHeader = exchange.getRequest()
                .getHeaders()
                .getFirst("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);

        // VALIDATE TOKEN
        if (!jwtUtil.isTokenValid(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // EXTRACT DATA FROM TOKEN
        String role = jwtUtil.extractRole(token).toUpperCase();
        String username = jwtUtil.extractUsername(token);
        String email = jwtUtil.extractEmail(token);

        // ROLE-BASED ACCESS
        if (path.startsWith("/providers/approve") || path.startsWith("/providers/reject")
                || (path.startsWith("/providers") && exchange.getRequest().getMethod().name().equals("GET")
                && !path.contains("/services"))) {
            if (!role.equals("ADMIN")) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        }

        if (path.startsWith("/requests/accept") || path.startsWith("/requests/reject")
                || path.startsWith("/requests/pending")) {
            if (!role.equals("PROVIDER")) {
                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                return exchange.getResponse().setComplete();
            }
        }

        // ADD USER CONTEXT HEADERS
        ServerWebExchange mutatedExchange = exchange.mutate()
                .request(builder -> builder
                .header("X-User-Name", username)
                .header("X-User-Role", role)
                .header("X-User-Email", email)
                .header("X-Gateway-Request", gatewaySecret))
                .build();

        return chain.filter(mutatedExchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
