package main.java.com.tab.dra2.entity;

import java.beans.ConstructorProperties;

import com.tab.dra2.enums.Role;
import jakarta.persistence.*;
import lombok.*;


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

    @Column (name = act_type, nullable = false)
    private int activityType;

    @Column (nullable = false)
    private int id_request;

    private int id_personel;

    @Column(length=20)
    private String seq_no;

    @Column(length=255,nullable=false)
    private String descirition;

    @Column(length=255,nullable=false)
    private String result;

    @Column(nullable=false)
    private String status;

    @Column (nullable=false)
    private DateTime date_register;

    @Column (nullable=false)
     private DateTime date_finished_canceled;

    

}
