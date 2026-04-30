package com.tab.dra2.entity;

import com.tab.dra2.enums.Act_Name;
import com.tab.dra2.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "activity_type")
@Getter 
@Setter
@Builder

public class Activity_Type {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_activity_type")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "act_type", length = 13)
    private Act_Name actType;

}
