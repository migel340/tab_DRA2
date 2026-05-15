package com.tab.dra2.entity;

import java.sql.Date;

import jakarta.persistence.*;
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
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_request")
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "id_device")
	private Device device;

	@ManyToOne
	@JoinColumn(name = "id_manager")
	private Personel manager;

	@Column(name = "description", length = 255, nullable = false)
	private String description;

	@Column(name = "status", length = 30, nullable = false)
	private String status;

	@Column(name = "date_registered", nullable = false)
	private Date dateRegistered;

	@Column(name = "date_finished_canceled")
	private Date dateFinishedCancelled;

	@OneToMany(mappedBy = "request")
	private List<Activity> activities;

}