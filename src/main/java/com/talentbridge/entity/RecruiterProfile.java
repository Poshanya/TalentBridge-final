package com.talentbridge.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class RecruiterProfile {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@JsonProperty("CompanyName")
	@NotBlank
	private String companyName;
	
	@NotBlank
	private String location;
	@NotBlank
	private String designation;
	@NotBlank
	@Pattern(regexp="^[0-9]{10}$")
	private String phone;
	 @Enumerated(EnumType.STRING)
	    private Role role;
	 
	 private LocalDateTime createdAt;
	 private LocalDateTime updatedAt;
	 
	 @PrePersist
	 protected void onCreate() {
	     createdAt = LocalDateTime.now();
	     updatedAt = LocalDateTime.now();
	 }

	 @PreUpdate
	 protected void onUpdate() {
	     updatedAt = LocalDateTime.now();
	 }
	
	@OneToOne
	private User user;
	
	public RecruiterProfile() {
		
	}
	
	

}
