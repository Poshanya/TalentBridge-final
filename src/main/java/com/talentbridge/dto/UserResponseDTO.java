package com.talentbridge.dto;

import java.time.LocalDateTime;

import com.talentbridge.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}