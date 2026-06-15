package com.tab.dra2.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UpdateActivityDto {

    @NotNull
    private Integer actTypeId;

    private Integer personelId;

    @Size(max = 20)
    private String seqNo;

    @NotNull
    @Size(max = 255)
    private String description;

    @Size(max = 255)
    private String result;

    @NotNull
    private String status;
}
