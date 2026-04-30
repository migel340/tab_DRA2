package com.tab.dra2.entity;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor

public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_address")
    private Long id;

     @Column(length = 20,nullable=false)
    private String city;

     @Column(length = 20,nullable=false)
    private String state;

     @Column(length = 6,nullable=false)
    private String postal_code;

     @Column(length = 20,nullable=false)
    private String country;

     @Column(nullable=false)
    private Int id_client;
}
