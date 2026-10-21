package com.talentbridge.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobResponseDTO {

    private Long id;

    private String title;
    private String CompanyName;
    private String description;
    private String location;
    private float salary;
    private String skills;

    private Long recruiterId;
    private String recruiterName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}