package com.tab.dra2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateActivityStatusDto {

    @NotBlank
    @Size(max = 30)
    private String status;
}
