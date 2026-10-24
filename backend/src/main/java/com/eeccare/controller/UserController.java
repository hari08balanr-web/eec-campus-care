package com.eeccare.controller;

import com.eeccare.dto.GoogleAuthRequest;
import com.eeccare.dto.UserLoginRequest;
import com.eeccare.dto.UserRegisterRequest;
import com.eeccare.model.User;
import com.eeccare.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@Valid @RequestBody UserLoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<User> register(@Valid @RequestBody UserRegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> registerMultipart(
            @RequestParam("name") String name,
            @RequestParam("rollNo") String rollNo,
            @RequestParam(value = "mobile", required = false) String mobile,
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "className", required = false) String className,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam("email") String email,
            @RequestParam(value = "password", required = false) String password,
            @RequestParam(value = "collegeName", required = false) String collegeName,
            @RequestParam(value = "idCard", required = false) MultipartFile idCard) {

        return ResponseEntity.ok(userService.registerWithIdCard(
                name, rollNo, mobile, department, className, year, email, password, collegeName, idCard));
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
