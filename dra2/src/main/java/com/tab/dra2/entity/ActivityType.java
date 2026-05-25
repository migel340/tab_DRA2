package com.tab.dra2.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "activity_type")
@Getter 
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class ActivityType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_activity_type")
    private Long id;

    @Column(name = "act_type", length = 100)
    private String actType;

}
