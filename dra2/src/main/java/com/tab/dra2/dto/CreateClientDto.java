package com.tab.dra2.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.sql.Date;

@Data
public class CreateClientDto {
    private Integer deviceId;

    private Long addressId;

    @Valid
    private ClientAddressDto address;

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
    @JsonAlias("tel")
    private String phoneNumber;

    @NotNull
    private Date birthDate;
}
