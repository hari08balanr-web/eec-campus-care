package com.eeccare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegisterRequest {
    @NotBlank
    private String name;
    
    @NotBlank
    private String rollNo;
    
    private String mobile;
    private String department;
    private String className;
    private Integer year;
    
    @Email
    @NotBlank
    private String email;
}
