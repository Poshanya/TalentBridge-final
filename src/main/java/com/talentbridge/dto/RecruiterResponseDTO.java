package com.talentbridge.dto;

import java.time.LocalDateTime;

import com.talentbridge.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecruiterResponseDTO {

    private Long id;

    @NotBlank 
    private String name;
    @NotBlank
    @Email
    private String email;
    private Role role;

    @NotBlank
    private String CompanyName;
    @NotBlank
    private String location;
    @NotBlank
    private String designation;
    @NotBlank
    @Pattern(regexp="^[0-9]{10}$")
    private String phone;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}