package com.talentbridge.entity;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateRequestDTO {
	
	@Valid
	private User user;
	@Valid
	private CandidateProfile candidateProfile;
}		