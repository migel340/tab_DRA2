package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActivityTypeResponseDto {
    private int id;
    private String actType;
}
