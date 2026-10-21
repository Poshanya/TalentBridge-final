package com.talentbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String CompanyName;

    @NotBlank
    private String description;

    @NotBlank
    private String location;

    @Positive
    private float salary;

    @NotBlank
    private String skills;
}