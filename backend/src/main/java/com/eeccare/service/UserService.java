package com.eeccare.service;

import com.eeccare.dto.GoogleAuthRequest;
import com.eeccare.dto.UserRegisterRequest;
import com.eeccare.model.User;
import com.eeccare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    public User register(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (request.getRollNo() != null && userRepository.existsByRollNo(request.getRollNo())) {
            throw new RuntimeException("Roll Number already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .rollNo(request.getRollNo())
                .mobile(request.getMobile())
                .department(request.getDepartment())
                .className(request.getClassName())
                .year(request.getYear())
                .email(request.getEmail())
                .build();
                
        return userRepository.save(user);
    }

    public User googleAuth(GoogleAuthRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setGoogleId(request.getGoogleId());
            return userRepository.save(user);
        }

        User newUser = User.builder()
                .email(request.getEmail())
                .name(request.getName())
                .googleId(request.getGoogleId())
                .build();
                
        return userRepository.save(newUser);
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
