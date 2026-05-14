package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class ClientResponse {
    private int id;
    private int deviceId;
    private Long addressId;
    private String surname;
    private String firstName;
    private String secondName;
    private String phoneNumber;
    private Date birthDate;
}
