package com.tab.dra2.entity;

import java.sql.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;
import jakarta.persistence.OneToMany;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "request")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {
    
@Id
@GeneratedValue
@NotBlank
@Column(name = "id_request")
private int id;

@NotBlank
@ManyToOne
@JoinColumn(name = "id_device", insertable = false, updatable = false)
private Device device;

@NotBlank
@ManyToOne
@JoinColumn(name = "id_manager", insertable = false, updatable = false)
private Personel manager;

@NotBlank
@Column(name = "description", length = 255)
private String description;

@NotBlank
@Column(name = "status", length = 30)
private String status;

@NotBlank
@Column(name = "date_registration")
private Date dateRegistration;

@NotBlank
@Column(name = "date_finished_cancelled")
private Date dateFinishedCancelled;

@OneToMany(mappedBy = "request")
private List<Activity> activities;

}