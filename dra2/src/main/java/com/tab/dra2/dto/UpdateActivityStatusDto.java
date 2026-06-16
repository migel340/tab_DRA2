package com.tab.dra2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateActivityStatusDto {

    @NotBlank
    @Size(max = 30)
    private String status;

    @Size(max = 255)
    private String result;
}
