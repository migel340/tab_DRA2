package com.tab.dra2.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import java.beans.JavaBean;
import java.sql.Date;

@Data
//@RequiredArgsConstructor
public class CreateClientDto {
    @NotNull
    private Integer deviceId;

    @NotNull
    private Long addressId;

    @NotNull
    @Size(max = 20)
    private String surname;

    @NotNull
    @Size(max = 20)
    private String firstName;

    @Size(max = 20)
    private String secondName;

    @NotNull
    @Size(max = 12)
    private String phoneNumber;

    @NotNull
    private Date birthDate;
}
