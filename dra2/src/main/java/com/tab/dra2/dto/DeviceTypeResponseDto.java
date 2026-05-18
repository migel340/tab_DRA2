package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeviceTypeResponseDto {
    private int id;
    private String deviceTypeName;
}
