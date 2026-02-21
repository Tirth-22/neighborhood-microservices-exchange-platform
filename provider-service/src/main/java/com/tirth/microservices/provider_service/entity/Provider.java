package com.tirth.microservices.provider_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // comes from JWT (X-User-Name)
    @Column(nullable = false, unique = true)
    private String username;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private ServiceType serviceType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProviderStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean active;

    private String approvedBy;
    private LocalDateTime approvedAt;

    @Version
    private Long version;

    @PrePersist
    public void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = ProviderStatus.PENDING; // Default to PENDING, requires admin approval
        }
        // active is derived from status, no need to set separately
    }

    /**
     * Active status is derived from ProviderStatus. Provider is active only
     * when status is ACTIVE.
     */
    public boolean isActive() {
        return this.status == ProviderStatus.ACTIVE;
    }

}
