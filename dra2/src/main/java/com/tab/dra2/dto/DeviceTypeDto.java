package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder // ???
public class DeviceTypeDto {
    private int id;
    private String deviceTypeName;
}
