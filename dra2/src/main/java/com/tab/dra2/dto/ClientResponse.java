package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class ClientResponse {
    private int id;
    private int deviceId;
    private int device_count;
    private Long addressId;
    private String surname;
    private String firstName;
    private String secondName;
    private String phoneNumber;
    private String tel;
    private String city;
    private String state;
    private String postal_code;
    private String country;
    private ClientAddressDto address;
    private Date birthDate;
}
