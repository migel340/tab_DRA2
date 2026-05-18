package com.tab.dra2.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data

public class CreateRequestDto {
    @NotNull
    private Integer deviceId;

    @NotNull
    private Integer managerId;

    @NotNull
    @Size(max = 255)
    private String description;

    @NotNull
    @Size(max = 30)
    private String status;
}
