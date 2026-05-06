package com.tab.dra2.dto;

import com.tab.dra2.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusResponse {
    private Long id;
    private String username;
    private String firstName;
    private String surname;
    private Role role;
    private Boolean active;
    private String message;
}
