package com.tab.dra2.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressDto {
    private int id;
    private String city;
    private String state;
    private String postalCode;
    private String country;
}
