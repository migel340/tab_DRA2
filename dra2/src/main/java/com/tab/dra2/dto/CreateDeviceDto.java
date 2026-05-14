package com.tab.dra2.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateDeviceDto {
    @NotNull
    private Integer deviceTypeId;

    @Size(max = 100)
    private String deviceName;
}
