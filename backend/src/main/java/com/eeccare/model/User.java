package com.eeccare.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    private String collegeName = "Eswari Engineering College";

    @Column(unique = true)
    private String rollNo;

    private String mobile;
    
    private String department;
    
    private String className;
    
    @Column(name = "\"year\"")
    private Integer year;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String idCardUrl;

    private String googleId;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
