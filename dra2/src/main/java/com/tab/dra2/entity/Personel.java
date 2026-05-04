package com.tab.dra2.entity;

import java.util.List;

import com.tab.dra2.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.OneToMany;

@Entity
@Table(name = "personel")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Personel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_personel")
    private Long id;

    @Column(name = "first_name", length = 20)
    private String firstName;

    @Column(length = 20)
    private String surname;

    @Enumerated(EnumType.STRING)
    @Column(length = 7)
    private Role role;

    @Column(length = 50, unique = true, nullable = false)
    private String username;

    @Column(length = 255, nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "manager")
    private List<Request> requests;

    @OneToMany(mappedBy = "personel")
    private List<Activity> activities;
}