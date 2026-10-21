package com.talentbridge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecruiterUpdateRequestDTO {

    @NotBlank
    private String CompanyName;

    @NotBlank
    private String location;

    @NotBlank
    private String designation;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$")
    private String phone;
}