package com.talentbridge.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class CandidateProfile {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	@Pattern(regexp="^[0-9]{10}$")
	private String phone;
	@NotBlank
	private String location;
	@NotBlank
	private String education;
	@NotBlank
	private String experience;
	@NotBlank
	private String skills;
	
	@OneToOne
	private User user;
	
	public CandidateProfile() {
		
	}	
	

}
