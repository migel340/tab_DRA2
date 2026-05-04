package com.tab.dra2.dto;

import com.tab.dra2.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import jakarta.validation.constraints.NotEmpty;

@Data
public class CreatePersonelRequest {

    @NotEmpty(message = "First name is required")
    @Size(max = 20)
    private String firstName;

    @NotEmpty(message = "Last name is required")
    @Size(max = 20)
    private String surname;

    @NotEmpty(message = "Username is required")
    @Size(max = 50)
    private String username;

    @NotEmpty(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    @NotNull(message = "Active flag is required")
    private Boolean active;
}
