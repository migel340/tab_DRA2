package com.tab.dra2.dto;

import com.tab.dra2.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdatePersonelRequest {

    @NotBlank(message = "First name is required")
    @Size(max = 20)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 20)
    private String surname;

    @NotBlank(message = "Username is required")
    @Size(max = 50)
    private String username;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    @NotNull(message = "Active flag is required")
    private Boolean active;
}
