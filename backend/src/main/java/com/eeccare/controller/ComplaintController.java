package com.eeccare.controller;

import com.eeccare.dto.ComplaintResponse;
import com.eeccare.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ComplaintResponse> createComplaint(
            @RequestParam("name") String name,
            @RequestParam(value = "className", required = false) String className,
            @RequestParam("mobile") String mobile,
            @RequestParam("email") String email,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("block") String block,
            @RequestParam(value = "floor", required = false) String floor,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "video", required = false) MultipartFile video) {

        ComplaintResponse response = complaintService.createComplaint(
                name, className, mobile, email, year, description, category, block, floor, photo, video);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(@RequestParam String email) {
        return ResponseEntity.ok(complaintService.getMyComplaints(email));
    }

    @GetMapping("/track/{ticketCode}")
    public ResponseEntity<ComplaintResponse> trackComplaint(@PathVariable String ticketCode) {
        return ResponseEntity.ok(complaintService.trackComplaint(ticketCode));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable UUID id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }
}
