package com.tab.dra2.entity;

import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Setter;
import lombok.NoArgsConstructor;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "client")
@Getter @Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor

public class Client {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_device")
    private Device device;

    @Column(name = "surname", length = 20)
    @NotBlank
    private String surname;

    @Column(name = "first_name", length = 20)
    @NotBlank
    private String firstName;

    @Column(name = "second_name", length = 20)
    private String secondName;

    @Column(name = "phone_number", length = 12)
    @NotBlank
    private String phoneNumber;

    @Column(name = "birth_date")
    private Date birthDate;

    @ManyToOne
    @JoinColumn(name = "id_address")
    private Address address;
}
