package com.tab.dra2.entity;

import com.tab.dra2.enums.ActivityName;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "activity_type")
@Getter 
@Setter
@Builder

public class ActivityType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_activity_type")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "act_type", length = 13)
    private ActivityName actType;

}
