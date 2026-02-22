package com.tirth.microservices.provider_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalTime;


@Entity
@Table(name = "provider_availability", indexes = {
    @Index(name = "idx_provider_day", columnList = "provider_username, day_of_week")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_username", nullable = false)
    private String providerUsername;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "slot_duration_minutes")
    private Integer slotDurationMinutes = 60;

    @Column(name = "is_available")
    private Boolean isAvailable = true;
}
