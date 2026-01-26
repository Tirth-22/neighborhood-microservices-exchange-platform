package com.tirth.microservices.api_gateway.filter;

import com.tirth.microservices.api_gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             GatewayFilterChain chain) {

        String authHeader =
                exchange.getRequest().getHeaders().getFirst("Authorization");

        // If no token → just forward (public endpoints)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return chain.filter(exchange);
        }

        String token = authHeader.substring(7);

        // Validate token
        if (!jwtUtil.isTokenValid(token)) {
            return chain.filter(exchange); // or reject later
        }

        String username = jwtUtil.extractUsername(token);
        String role = jwtUtil.extractRole(token);

        // ADD INTERNAL TRUST HEADER
        ServerHttpRequest modifiedRequest =
                exchange.getRequest()
                        .mutate()
                        .header("X-User-Name", username)
                        .header("X-User-Role", role)
                        .header("X-Gateway-Request", "true") //IMPORTANT
                        .build();

        return chain.filter(
                exchange.mutate().request(modifiedRequest).build()
        );
    }
}
