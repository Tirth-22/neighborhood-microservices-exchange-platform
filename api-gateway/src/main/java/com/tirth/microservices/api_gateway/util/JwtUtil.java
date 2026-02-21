package com.tirth.microservices.api_gateway.util;

import java.nio.charset.StandardCharsets;
import java.security.Key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // VALIDATE TOKEN
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // EXTRACT ROLE
    public String extractRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    // EXTRACT USERNAME (FIXED)
    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public String extractEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    // INTERNAL CLAIMS PARSER
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
