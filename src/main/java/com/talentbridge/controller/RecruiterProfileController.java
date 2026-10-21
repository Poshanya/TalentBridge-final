package com.talentbridge.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talentbridge.dto.RecruiterResponseDTO;
import com.talentbridge.dto.RecruiterUpdateRequestDTO;
import com.talentbridge.entity.RecruiterProfile;
import com.talentbridge.entity.RecruiterRequestDTO;
import com.talentbridge.service.RecruiterProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/recruiters")
public class RecruiterProfileController {

    private final RecruiterProfileService recruiterProfileService;

    public RecruiterProfileController(RecruiterProfileService recruiterProfileService) {
        this.recruiterProfileService = recruiterProfileService;
    }

    @PostMapping
    public ResponseEntity<RecruiterProfile> createRecruiterProfile(
            @Valid @RequestBody RecruiterRequestDTO request) {

        RecruiterProfile profile = recruiterProfileService.createRecruiter(
                request.getUser(),
                request.getRecruiterProfile()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @GetMapping("/me")
    public ResponseEntity<RecruiterResponseDTO> getMyRecruiterProfile(Principal principal) {
        RecruiterResponseDTO dto = recruiterProfileService.getRecruiterByEmail(principal.getName());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecruiterResponseDTO> getRecruiterById(
            @PathVariable Long id,
            Principal principal) {

        RecruiterResponseDTO dto = recruiterProfileService.getRecruiterById(id, principal.getName());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecruiterProfile> updateRecruiter(
            @PathVariable Long id,
            @Valid @RequestBody RecruiterUpdateRequestDTO updatedProfile,
            Principal principal) {

        RecruiterProfile updated = recruiterProfileService.updateRecruiter(
                id, updatedProfile, principal.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecruiterProfile(
            @PathVariable Long id,
            Principal principal) {
        recruiterProfileService.deleteRecruiter(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<RecruiterResponseDTO>> getAllRecruiters() {
        return ResponseEntity.ok(recruiterProfileService.getAllRecruiters());
    }
}


