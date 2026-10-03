package com.eeccare.dto;

import com.eeccare.model.Complaint;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class ComplaintResponse {
    private UUID id;
    private String ticketCode;
    private String name;
    private String className;
    private String mobile;
    private String email;
    private Integer year;
    private String description;
    private String category;
    private String block;
    private String floor;
    private LocalDate complaintDate;
    private LocalTime complaintTime;
    private String photoUrl;
    private String videoUrl;
    private String status;
    private String adminRemarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ComplaintResponse fromEntity(Complaint complaint) {
        ComplaintResponse dto = new ComplaintResponse();
        BeanUtils.copyProperties(complaint, dto);
        return dto;
    }
}
