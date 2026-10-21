package com.eeccare.service;

import com.eeccare.dto.AdminStatsResponse;
import com.eeccare.dto.ComplaintResponse;
import com.eeccare.dto.StatusUpdateRequest;
import com.eeccare.exception.ResourceNotFoundException;
import com.eeccare.model.Complaint;
import com.eeccare.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final SupabaseStorageService storageService;
    private final EmailService emailService;

    public ComplaintResponse createComplaint(
            String name, String className, String mobile, String email, Integer year,
            String description, String category, String block, String floor,
            MultipartFile photo, MultipartFile video) {

        String ticketCode = generateTicketCode();
        
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = storageService.uploadFile(photo, ticketCode + "_photo");
        }
        
        String videoUrl = null;
        if (video != null && !video.isEmpty()) {
            videoUrl = storageService.uploadFile(video, ticketCode + "_video");
        }

        Complaint complaint = Complaint.builder()
                .ticketCode(ticketCode)
                .name(name)
                .className(className)
                .mobile(mobile)
                .email(email)
                .year(year)
                .description(description)
                .category(category)
                .block(block)
                .floor(floor)
                .complaintDate(LocalDate.now())
                .complaintTime(LocalTime.now())
                .photoUrl(photoUrl)
                .videoUrl(videoUrl)
                .status("Pending")
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);
        
        // Send email async
        emailService.sendComplaintConfirmation(email, name, ticketCode);

        return ComplaintResponse.fromEntity(savedComplaint);
    }

    private synchronized String generateTicketCode() {
        int currentYear = LocalDate.now().getYear();
        long count = complaintRepository.countByYear(currentYear);
        return String.format("EEC-%d-%04d", currentYear, count + 1);
    }

    public List<ComplaintResponse> getMyComplaints(String email) {
        return complaintRepository.findByEmailOrderByCreatedAtDesc(email).stream()
                .map(ComplaintResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ComplaintResponse trackComplaint(String ticketCode) {
        return complaintRepository.findByTicketCode(ticketCode)
                .map(ComplaintResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found for ticket code: " + ticketCode));
    }

    public ComplaintResponse getComplaintById(UUID id) {
        return complaintRepository.findById(id)
                .map(ComplaintResponse::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found for id: " + id));
    }

    public List<ComplaintResponse> getAllComplaints(String category, String status, String search) {
        List<Complaint> complaints;
        
        if (search != null && !search.isEmpty()) {
            complaints = complaintRepository.searchByTicketCode(search);
        } else if (category != null && status != null) {
            complaints = complaintRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, status);
        } else if (category != null) {
            complaints = complaintRepository.findByCategoryOrderByCreatedAtDesc(category);
        } else if (status != null) {
            complaints = complaintRepository.findByStatusOrderByCreatedAtDesc(status);
        } else {
            complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
        }
        
        return complaints.stream().map(ComplaintResponse::fromEntity).collect(Collectors.toList());
    }

    public ComplaintResponse updateStatus(UUID id, StatusUpdateRequest request) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
                
        complaint.setStatus(request.getStatus());
        complaint.setAdminRemarks(request.getAdminRemarks());
        
        Complaint updated = complaintRepository.save(complaint);
        
        emailService.sendStatusUpdate(
                complaint.getEmail(), 
                complaint.getName(), 
                complaint.getTicketCode(), 
                request.getStatus(), 
                request.getAdminRemarks()
        );
        
        return ComplaintResponse.fromEntity(updated);
    }

    public AdminStatsResponse getStats() {
        long total = complaintRepository.count();
        long pending = complaintRepository.countByStatus("Pending");
        long inReview = complaintRepository.countByStatus("In Review");
        long inProgress = complaintRepository.countByStatus("In Progress");
        long resolved = complaintRepository.countByStatus("Resolved");
        long rejected = complaintRepository.countByStatus("Rejected");
        
        List<Object[]> categoryCounts = complaintRepository.countByCategoryBreakdown();
        Map<String, Long> categoryBreakdown = new HashMap<>();
        for (Object[] row : categoryCounts) {
            categoryBreakdown.put((String) row[0], (Long) row[1]);
        }
        
        return AdminStatsResponse.builder()
                .totalComplaints(total)
                .pending(pending)
                .inReview(inReview)
                .inProgress(inProgress)
                .resolved(resolved)
                .rejected(rejected)
                .categoryBreakdown(categoryBreakdown)
                .build();
    }
}
