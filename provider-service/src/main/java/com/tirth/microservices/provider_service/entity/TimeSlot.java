package com.tirth.microservices.provider_service.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "time_slots", indexes = {
    @Index(name = "idx_slot_provider_date", columnList = "provider_username, slot_date"),
    @Index(name = "idx_slot_status", columnList = "provider_username, is_booked")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_username", nullable = false)
    private String providerUsername;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "is_booked")
    private Boolean isBooked = false;

    @Column(name = "booked_by")
    private String bookedBy;

    @Column(name = "request_id")
    private Long requestId;
}
