package com.tab.dra2.dto;

import com.tab.dra2.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String username;
    private String firstName;
    private String surname;
    private Role role;
}