package com.tab.dra2.entity;


import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "activity")
@Getter 
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_activity")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "act_type")
    private ActivityType activityType;

    @ManyToOne
    @JoinColumn(name = "id_request")
    private Request request;

    @ManyToOne
    @JoinColumn(name = "id_personel")
    private Personel personel;
    @Column(name = "seq_no", length = 20)
    private String seqNo;

    @Column(length=255,nullable=false)
    private String description;

    @Column(length = 255)
    private String result;

    @Column(nullable = false)
    private String status;

    @Column(name = "date_registered", nullable = false)
    private LocalDateTime dateRegistered;

    @Column(name = "date_finished_canceled")
    private LocalDateTime dateFinishedCanceled;
    
}



