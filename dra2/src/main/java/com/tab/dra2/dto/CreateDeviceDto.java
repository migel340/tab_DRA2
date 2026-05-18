package com.tab.dra2.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data

public class CreateDeviceDto {
    @NotNull
    private Integer deviceTypeId;

    @Size(max = 100)
    private String deviceName;
}
