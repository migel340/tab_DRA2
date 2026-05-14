package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class RequestResponse {
    private int id;
    private int deviceId;
    private int managerId;
    private String description;
    private String status;
    private Date dateRegistration;
    private Date dateFinishedCancelled;
}
