package com.eeccare.controller;

import com.eeccare.dto.AdminLoginRequest;
import com.eeccare.dto.AdminStatsResponse;
import com.eeccare.dto.ComplaintResponse;
import com.eeccare.dto.StatusUpdateRequest;
import com.eeccare.dto.SubAdminRequest;
import com.eeccare.model.Admin;
import com.eeccare.service.AdminService;
import com.eeccare.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ComplaintService complaintService;

    @PostMapping("/login")
    public ResponseEntity<Admin> login(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(adminService.login(request));
    }

    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(complaintService.getAllComplaints(category, status, search));
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintDetail(@PathVariable UUID id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(complaintService.updateStatus(id, request));
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(complaintService.getStats());
    }

    @PostMapping("/sub-admins")
    public ResponseEntity<Admin> addSubAdmin(@Valid @RequestBody SubAdminRequest request) {
        return ResponseEntity.ok(adminService.addSubAdmin(request));
    }
}
