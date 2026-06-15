package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

import java.lang.Long;

@Data
@Builder
public class ActivityTypeResponseDto {
    private Long id;
    private String actType;
}
