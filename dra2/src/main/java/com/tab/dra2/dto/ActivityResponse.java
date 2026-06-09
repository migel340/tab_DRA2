package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityResponse {
    private int id;
    private int requestId;
    private ActivityTypeResponseDto type;
    private PersonelResponse executor;
    private String seqNo;
    private String description;
    private String result;
    private String status;
    private LocalDateTime dateRegistration;
    private LocalDateTime dateFinishedCancelled;

}
