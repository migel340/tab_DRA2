package com.tab.dra2.web;

import com.tab.dra2.dto.AuthResponse;
import com.tab.dra2.dto.ApiResponse;
import com.tab.dra2.dto.LoginRequest;
import com.tab.dra2.dto.RegisterRequest;
import com.tab.dra2.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authorization")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse data = authService.login(request);
        ApiResponse<AuthResponse> resp = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("OK")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/register")
    @Operation(summary = "Register new member (default role: STAFF)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse data = authService.register(request);
        ApiResponse<AuthResponse> resp = ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Created")
                .data(data)
                .timestamp(java.time.LocalDateTime.now())
                .build();
        return ResponseEntity.ok(resp);
    }
}