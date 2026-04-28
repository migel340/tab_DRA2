package com.tab.dra2.entity;

import java.sql.Date;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

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
@Column(name = "id_device")
private int idDevice;

@NotBlank
@Column(name = "id_manager")
private int idManager;

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

}
