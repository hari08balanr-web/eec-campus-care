package com.eeccare.controller;

import com.eeccare.dto.GoogleAuthRequest;
import com.eeccare.dto.UserRegisterRequest;
import com.eeccare.model.User;
import com.eeccare.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody UserRegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/google-auth")
    public ResponseEntity<User> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
        return ResponseEntity.ok(userService.googleAuth(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@RequestParam String email) {
        return ResponseEntity.ok(userService.getProfile(email));
    }
}
