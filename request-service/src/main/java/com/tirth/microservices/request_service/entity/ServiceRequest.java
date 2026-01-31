package com.tirth.microservices.request_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // what service user requested (ELECTRICIAN, PLUMBER)
    @Column(nullable = false)
    private String serviceType;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "requested_by", nullable = false)
    private String requestedBy;

    // 🔥 OWNER OF THIS REQUEST (THIS FIXES YOUR BUG)
    @Column(name = "provider_username", nullable = false)
    private String providerUsername;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    @Column
    private String acceptedBy;

    @Column(name = "rejected_by")
    private String rejectedBy;

    private LocalDateTime acceptedAt;
    private LocalDateTime rejectedAt;
    private LocalDateTime completedAt;

    @PrePersist
    public void onCreate() {
        this.status = RequestStatus.CREATED;
    }
}
