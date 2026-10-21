package com.talentbridge.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationResponseDTO {

    private Long id;

    private String status;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    private Long candidateId;
    private String candidateName;

    private Long jobId;
    private String jobTitle;
    private String companyName;
}