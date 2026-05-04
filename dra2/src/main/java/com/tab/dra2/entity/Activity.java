package com.tab.dra2.entity;

import java.beans.ConstructorProperties;

import java.time.LocalDateTime;
import com.tab.dra2.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.manytoone.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "activity")
@Getter 
@Setter
@Builder

public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_activity")
    private Long id;

   @Column(name = "act_type", nullable = false)
    private int activityType;

    @ManyToOne
    @JoinColumn(name = "id_request", insertable = false, updatable = false)
    private Request request;

    @ManyToOne
    @JoinColumn(name = "id_personel", insertable = false, updatable = false)
    private Personel personel;

    @Column(length=20)
    private String seq_no;

    @Column(length=255,nullable=false)
    private String description;

    @Column(length=255,nullable=false)
    private String result;

    @Column(nullable=false)
    private String status;

   @Column(name = "date_register", nullable = false)
private LocalDateTime dateRegister;

     @Column(name = "date_finished_canceled", nullable = false)
    private LocalDateTime dateFinishedCanceled;
    

}
