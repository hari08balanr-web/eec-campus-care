package com.eeccare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubAdminRequest {
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String name;
    
    @NotBlank
    private String password;
}
