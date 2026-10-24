package com.eeccare.service;

import com.eeccare.dto.GoogleAuthRequest;
import com.eeccare.dto.UserLoginRequest;
import com.eeccare.dto.UserRegisterRequest;
import com.eeccare.exception.ResourceNotFoundException;
import com.eeccare.model.User;
import com.eeccare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    
    private final UserRepository userRepository;
    private final SupabaseStorageService storageService;

    public User register(UserRegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered with another student account");
        }
        if (request.getRollNo() != null && userRepository.existsByRollNo(request.getRollNo().trim())) {
            throw new RuntimeException("Roll Number already registered with another account");
        }

        String college = (request.getCollegeName() != null && !request.getCollegeName().isBlank()) 
                ? request.getCollegeName().trim() : "Eswari Engineering College";

        User user = User.builder()
                .name(request.getName().trim())
                .collegeName(college)
                .rollNo(request.getRollNo().trim())
                .mobile(request.getMobile())
                .department(request.getDepartment())
                .className(request.getClassName())
                .year(request.getYear())
                .email(email)
                .password(request.getPassword())
                .idCardUrl(request.getIdCardUrl())
                .build();
                
        return userRepository.save(user);
    }

    public User registerWithIdCard(
            String name, String rollNo, String mobile, String department, 
            String className, Integer year, String email, String password, 
            String collegeName, MultipartFile idCard) {

        String normalizedEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException("Email already registered with another student account");
        }
        if (rollNo != null && userRepository.existsByRollNo(rollNo.trim())) {
            throw new RuntimeException("Roll Number already registered with another account");
        }

        String idCardUrl = null;
        if (idCard != null && !idCard.isEmpty()) {
            idCardUrl = storageService.uploadFile(idCard, "id_card_" + rollNo.trim());
        }

        String college = (collegeName != null && !collegeName.isBlank()) 
                ? collegeName.trim() : "Eswari Engineering College";

        User user = User.builder()
                .name(name.trim())
                .collegeName(college)
                .rollNo(rollNo.trim())
                .mobile(mobile)
                .department(department)
                .className(className)
                .year(year)
                .email(normalizedEmail)
                .password(password)
                .idCardUrl(idCardUrl)
                .build();

        return userRepository.save(user);
    }

    public User login(UserLoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No student account found for email: " + email + ". Please register first."));

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            if (!user.getPassword().equals(request.getPassword())) {
                throw new IllegalArgumentException("Incorrect password. Please verify your credentials.");
            }
        } else {
            // If registered previously via Google or legacy without password, save this password for subsequent logins
            user.setPassword(request.getPassword());
            userRepository.save(user);
        }

        return user;
    }

    public User googleAuth(GoogleAuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setGoogleId(request.getGoogleId());
            return userRepository.save(user);
        }

        User newUser = User.builder()
                .email(email)
                .name(request.getName())
                .collegeName("Eswari Engineering College")
                .googleId(request.getGoogleId())
                .build();
                
        return userRepository.save(newUser);
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
