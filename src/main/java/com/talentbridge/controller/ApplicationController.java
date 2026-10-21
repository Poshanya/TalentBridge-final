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

import com.talentbridge.dto.ApplicationResponseDTO;
import com.talentbridge.entity.Application;
import com.talentbridge.entity.ApplicationStatus;
import com.talentbridge.service.ApplicationService;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/candidate/{candidateId}/job/{jobId}")
    public ResponseEntity<Application> applyForJob(
            @PathVariable Long candidateId,
            @PathVariable Long jobId,
            @RequestBody(required = false) Application application,
            Principal principal) {

        if (application == null) {
            application = new Application();
        }
        Application created = applicationService.applyForJob(
                candidateId,
                jobId,
                application,
                principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/job/{jobId}")
    public ResponseEntity<Application> applyForJobCurrentCandidate(
            @PathVariable Long jobId,
            @RequestBody(required = false) Application application,
            Principal principal) {

        if (application == null) {
            application = new Application();
        }
        Application created = applicationService.applyForJobByAuthenticatedCandidate(
                jobId,
                application,
                principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationResponseDTO>> getMyCandidateApplications(Principal principal) {
        return ResponseEntity.ok(applicationService.getMyCandidateApplications(principal.getName()));
    }

    @GetMapping("/recruiter-jobs")
    public ResponseEntity<List<ApplicationResponseDTO>> getMyRecruiterJobApplications(Principal principal) {
        return ResponseEntity.ok(applicationService.getMyRecruiterJobApplications(principal.getName()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponseDTO>> getApplicationsForJob(
            @PathVariable Long jobId,
            Principal principal) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponseDTO>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponseDTO> getApplicationById(
            @PathVariable Long id,
            Principal principal) {

        return ResponseEntity.ok(applicationService.getApplicationById(id, principal.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Application> updateApplication(
            @PathVariable Long id,
            @RequestBody ApplicationStatus status,
            Principal principal) {

        Application updated = applicationService.updateApplication(id, status, principal.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            Principal principal) {

        applicationService.deleteApplication(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}