package com.talentbridge.dto;

import com.talentbridge.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationUpdateRequestDTO {

    @NotNull(message = "Application status is required and must match valid options")
    private ApplicationStatus status; // This forces the input to match your Enum options
}
