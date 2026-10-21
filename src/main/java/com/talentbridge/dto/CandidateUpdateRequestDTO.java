package com.talentbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CandidateUpdateRequestDTO {

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$")
    private String phone;

    @NotBlank
    private String location;

    @NotBlank
    private String education;

    @NotBlank
    private String experience;

    @NotBlank
    private String skills;
}