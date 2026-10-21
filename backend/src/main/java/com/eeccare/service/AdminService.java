package com.eeccare.service;

import com.eeccare.dto.AdminLoginRequest;
import com.eeccare.dto.SubAdminRequest;
import com.eeccare.exception.ResourceNotFoundException;
import com.eeccare.model.Admin;
import com.eeccare.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public Admin login(AdminLoginRequest request) {
        return adminRepository.findByEmailAndPassword(request.getEmail(), request.getPassword())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
    }

    public Admin addSubAdmin(SubAdminRequest request) {
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Admin with this email already exists");
        }
        
        Admin admin = Admin.builder()
                .email(request.getEmail())
                .password(request.getPassword()) // Plaintext as requested
                .name(request.getName())
                .role("SUB_ADMIN")
                .build();
                
        return adminRepository.save(admin);
    }
}
