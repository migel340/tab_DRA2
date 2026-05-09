package com.tab.dra2.config;

import com.tab.dra2.entity.Personel;
import com.tab.dra2.enums.Role;
import com.tab.dra2.repository.PersonelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final PersonelRepository personelRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!personelRepository.existsByUsername("admin")) {
            Personel admin = Personel.builder()
                    .firstName("Admin")
                    .surname("System")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            personelRepository.save(admin);
            log.info(">>> Created default admin account: admin / admin123");
        }
    }
}