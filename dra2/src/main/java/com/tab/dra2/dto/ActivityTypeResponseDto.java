package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ActivityTypeResponseDto {
    private Long id;
    private String actType;
}
