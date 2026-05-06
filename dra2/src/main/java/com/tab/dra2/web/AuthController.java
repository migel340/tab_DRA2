package com.tab.dra2.web;

import com.tab.dra2.dto.AuthResponse;
import com.tab.dra2.dto.LoginRequest;
import com.tab.dra2.dto.RegisterRequest;
import com.tab.dra2.dto.UserStatusRequest;
import com.tab.dra2.dto.UserStatusResponse;
import com.tab.dra2.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authorization")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new member (default role: STAFF)")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/users/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Toggle user active/inactive status (ADMIN only)", 
               security = @SecurityRequirement(name = "Bearer"))
    public ResponseEntity<UserStatusResponse> toggleUserStatus(@Valid @RequestBody UserStatusRequest request) {
        return ResponseEntity.ok(authService.toggleUserStatus(request));
    }

    @PostMapping("/users/{userId}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate user (ADMIN only)", 
               security = @SecurityRequirement(name = "Bearer"))
    public ResponseEntity<UserStatusResponse> activateUser(@PathVariable Long userId) {
        return ResponseEntity.ok(authService.activateUser(userId));
    }

    @PostMapping("/users/{userId}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate user (ADMIN only)", 
               security = @SecurityRequirement(name = "Bearer"))
    public ResponseEntity<UserStatusResponse> deactivateUser(@PathVariable Long userId) {
        return ResponseEntity.ok(authService.deactivateUser(userId));
    }
}