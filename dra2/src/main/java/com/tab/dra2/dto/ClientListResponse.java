package com.tab.dra2.dto;

import java.sql.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClientListResponse {
    private int id;
    private int device_count;
    private String surname;
    private String firstName;
    private String phoneNumber;
    private Date birthDate;
}
