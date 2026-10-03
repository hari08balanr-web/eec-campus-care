package com.eeccare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleAuthRequest {
    @NotBlank
    private String googleId;
    
    @Email
    @NotBlank
    private String email;
    
    @NotBlank
    private String name;
}
