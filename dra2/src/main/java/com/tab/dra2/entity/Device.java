package com.tab.dra2.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Device {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_device")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_device_type")
    private DeviceType deviceType;
    
    @Column(name = "device_name", length = 100, nullable = false)
    private String deviceName;

    @OneToMany(mappedBy = "device")
    private List<Request> requests;
}