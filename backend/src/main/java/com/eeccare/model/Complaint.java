package com.eeccare.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complaint {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String ticketCode; // Format: EEC-YYYY-NNNN

    private UUID userId;

    private String name;
    
    private String className;
    
    private String mobile;
    
    private String email;
    
    private Integer year;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    @Column(nullable = false)
    private String block;

    private String floor;

    private LocalDate complaintDate;

    private LocalTime complaintTime;

    private String photoUrl;

    private String videoUrl;

    @Builder.Default
    private String status = "Pending";

    @Column(columnDefinition = "TEXT")
    private String adminRemarks;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
