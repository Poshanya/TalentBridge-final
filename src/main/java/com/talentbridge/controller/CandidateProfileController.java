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

import com.talentbridge.dto.CandidateResponseDTO;
import com.talentbridge.dto.CandidateUpdateRequestDTO;
import com.talentbridge.entity.CandidateProfile;
import com.talentbridge.entity.CandidateRequestDTO;
import com.talentbridge.service.CandidateProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/candidates")
public class CandidateProfileController {

    private final CandidateProfileService candidateProfileService;

    public CandidateProfileController(
            CandidateProfileService candidateProfileService) {

        this.candidateProfileService = candidateProfileService;
    }

    @PostMapping
    public ResponseEntity<CandidateProfile> createCandidate(
          @Valid @RequestBody CandidateRequestDTO request) {

        CandidateProfile profile = candidateProfileService.createCandidate(
                request.getUser(),
                request.getCandidateProfile());
        return ResponseEntity.status(HttpStatus.CREATED).body(profile);
    }

    @GetMapping("/me")
    public ResponseEntity<CandidateResponseDTO> getMyCandidateProfile(Principal principal) {
        CandidateResponseDTO dto = candidateProfileService.getCandidateByEmail(principal.getName());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateResponseDTO> getCandidateById(
            @PathVariable Long id,
            Principal principal) {
        CandidateResponseDTO dto = candidateProfileService.getCandidateById(id, principal.getName());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateProfile> updateCandidate(
            @PathVariable Long id,
            @Valid @RequestBody CandidateUpdateRequestDTO updatedProfile,
            Principal principal) {

        CandidateProfile updated = candidateProfileService.updatedCandidate(
                id, updatedProfile, principal.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidate(
            @PathVariable Long id,
            Principal principal) {

        candidateProfileService.deleteCandidate(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<CandidateResponseDTO>> getALLCandidates() {
        return ResponseEntity.ok(candidateProfileService.getALLCandidates());
    }
}