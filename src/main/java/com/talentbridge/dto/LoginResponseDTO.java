package com.talentbridge.dto;

import com.talentbridge.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String token;
}