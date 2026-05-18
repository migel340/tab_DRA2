package com.tab.dra2.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class ActivityTypeSaveDto {
    @NotEmpty
    private String actType;
}
