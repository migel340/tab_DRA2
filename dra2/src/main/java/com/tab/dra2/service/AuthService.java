package com.tab.dra2.service;

import com.tab.dra2.dto.AuthResponse;
import com.tab.dra2.dto.LoginRequest;
import com.tab.dra2.dto.RegisterRequest;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.enums.Role;
import com.tab.dra2.repository.PersonelRepository;
import com.tab.dra2.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PersonelRepository personelRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (personelRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        Personel personel = Personel.builder()
                .firstName(request.getFirstName())
                .surname(request.getSurname())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STAFF)
                .active(true)
                .build();

        personel = personelRepository.save(personel);

        String token = jwtUtil.generateToken(personel.getUsername(), personel.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(personel.getId())
                .username(personel.getUsername())
                .firstName(personel.getFirstName())
                .surname(personel.getSurname())
                .role(personel.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        Personel personel = personelRepository.findByUsername(request.getUsername())
                .orElseThrow();

        String token = jwtUtil.generateToken(personel.getUsername(), personel.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .id(personel.getId())
                .username(personel.getUsername())
                .firstName(personel.getFirstName())
                .surname(personel.getSurname())
                .role(personel.getRole())
                .build();
    }
}