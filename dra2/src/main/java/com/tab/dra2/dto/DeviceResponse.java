package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DeviceResponse {
    private int id;
    private int deviceTypeId;
    private String deviceName;
}
