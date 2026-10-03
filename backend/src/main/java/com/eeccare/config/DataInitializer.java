package com.eeccare.config;

import com.eeccare.model.Admin;
import com.eeccare.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;

    @Override
    public void run(String... args) {
        String mainAdminEmail = "warnerthepro@gmail.com";
        
        if (adminRepository.findByEmail(mainAdminEmail).isEmpty()) {
            Admin mainAdmin = Admin.builder()
                    .email(mainAdminEmail)
                    .password("admin123")
                    .name("Main Admin")
                    .role("MAIN_ADMIN")
                    .build();
            adminRepository.save(mainAdmin);
        }
    }
}
