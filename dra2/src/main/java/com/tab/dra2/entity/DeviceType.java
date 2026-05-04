package com.tab.dra2.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DeviceType {
    
    @Id
    @GeneratedValue
    @Column(name = "id_device_type")
    @NotBlank    
    private int id;

    @Column(name = "device_type_name", length = 50, unique = true, nullable = false)
    private String deviceTypeName;
}