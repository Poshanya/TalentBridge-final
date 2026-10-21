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

import com.talentbridge.dto.JobRequestDTO;
import com.talentbridge.dto.JobResponseDTO;
import com.talentbridge.dto.JobUpdateRequestDTO;
import com.talentbridge.entity.Job;
import com.talentbridge.service.JobService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/recruiter/{recruiterId}")
    public ResponseEntity<Job> createJob(
            @PathVariable Long recruiterId,
            @Valid @RequestBody JobRequestDTO jobDto,
            Principal principal) {

        Job createdJob = jobService.createJob(recruiterId, jobDto, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    @PostMapping
    public ResponseEntity<Job> createJobForCurrentRecruiter(
            @Valid @RequestBody JobRequestDTO jobDto,
            Principal principal) {

        Job createdJob = jobService.createJobForAuthenticatedRecruiter(jobDto, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    @GetMapping
    public ResponseEntity<List<JobResponseDTO>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<JobResponseDTO>> getMyJobs(Principal principal) {
        return ResponseEntity.ok(jobService.getJobsByRecruiter(principal.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobUpdateRequestDTO updatedJobDto,
            Principal principal) {

        Job updatedJob = jobService.updateJob(id, updatedJobDto, principal.getName());
        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            Principal principal) {

        jobService.deleteJob(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}

