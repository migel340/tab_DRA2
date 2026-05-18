package com.tab.dra2.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.sql.Date;

@Data
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
