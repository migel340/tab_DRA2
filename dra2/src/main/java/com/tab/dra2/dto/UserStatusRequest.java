package com.tab.dra2.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatusRequest {
    @NotNull
    private Long userId;
    
    @NotNull
    private Boolean active;
}
