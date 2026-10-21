package com.talentbridge.entity;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecruiterRequestDTO {

	@Valid
	private User user;
	@Valid
	private RecruiterProfile recruiterProfile;
}
