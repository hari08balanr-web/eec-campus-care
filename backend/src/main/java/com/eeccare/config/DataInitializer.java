package com.eeccare.config;

import com.eeccare.model.Admin;
import com.eeccare.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;

    @Override
    public void run(String... args) {
        // Main Admin 1
        seedAdmin("warnerthepro@gmail.com", "admin123", "Main Admin", "MAIN_ADMIN");

        // Main Admin 2 (Faculty In-Charge)
        seedAdmin("amsavalli.k@eec.srmrmp.edu.in", "admin123", "Prof. Amsavalli K", "MAIN_ADMIN");
    }

    private void seedAdmin(String email, String password, String name, String role) {
        if (adminRepository.findByEmail(email).isEmpty()) {
            Admin admin = Admin.builder()
                    .email(email)
                    .password(password)
                    .name(name)
                    .role(role)
                    .build();
            adminRepository.save(admin);
            log.info("[EEC CARE] Seeded Admin account: {}", email);
        }
    }
}
