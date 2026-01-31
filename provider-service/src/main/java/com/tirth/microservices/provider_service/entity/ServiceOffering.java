package com.tirth.microservices.provider_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_offerings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceOffering {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "provider_username", nullable = false)
    private String providerUsername;

    @Column(nullable = false)
    private String category;

    @Builder.Default
    private boolean active = true;
}
