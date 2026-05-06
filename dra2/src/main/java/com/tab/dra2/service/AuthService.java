package com.tab.dra2.service;

import com.tab.dra2.dto.AuthResponse;
import com.tab.dra2.dto.LoginRequest;
import com.tab.dra2.dto.RegisterRequest;
import com.tab.dra2.dto.UserStatusRequest;
import com.tab.dra2.dto.UserStatusResponse;
import com.tab.dra2.entity.Personel;
import com.tab.dra2.enums.Role;
import com.tab.dra2.repository.PersonelRepository;
import com.tab.dra2.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public UserStatusResponse toggleUserStatus(UserStatusRequest request) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Personel currentUser = personelRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("Current user not found"));

        if (currentUser.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Only ADMIN can change user status");
        }

        Personel userToUpdate = personelRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + request.getUserId()));

        if (currentUser.getId().equals(userToUpdate.getId()) && !request.getActive()) {
            throw new IllegalArgumentException("You cannot deactivate your own account");
        }

        userToUpdate.setActive(request.getActive());
        userToUpdate = personelRepository.save(userToUpdate);

        String message = request.getActive() ? "User activated successfully" : "User deactivated successfully";

        return UserStatusResponse.builder()
                .id(userToUpdate.getId())
                .username(userToUpdate.getUsername())
                .firstName(userToUpdate.getFirstName())
                .surname(userToUpdate.getSurname())
                .role(userToUpdate.getRole())
                .active(userToUpdate.isActive())
                .message(message)
                .build();
    }

    public UserStatusResponse deactivateUser(Long userId) {
        return toggleUserStatus(UserStatusRequest.builder()
                .userId(userId)
                .active(false)
                .build());
    }

    public UserStatusResponse activateUser(Long userId) {
        return toggleUserStatus(UserStatusRequest.builder()
                .userId(userId)
                .active(true)
                .build());
    }
}