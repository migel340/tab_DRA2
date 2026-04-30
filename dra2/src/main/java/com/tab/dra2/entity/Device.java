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

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Device {
    
    @Id
    @GeneratedValue
    @Column(name = "id_device")
    @NotBlank
    private int id;

    @NotBlank
    @Column(name = "id_device_type")
    private int idDeviceType;
    
    @Column(name = "device_name", length = 100, nullable = false)
    private String deviceName;
}