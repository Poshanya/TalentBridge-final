package com.talentbridge.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.talentbridge.dto.ApplicationResponseDTO;
import com.talentbridge.entity.Application;
import com.talentbridge.entity.ApplicationStatus;
import com.talentbridge.entity.CandidateProfile;
import com.talentbridge.entity.Job;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.repository.ApplicationRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateProfileService candidateProfileService;
    private final JobService jobService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            CandidateProfileService candidateProfileService,
            JobService jobService) {

        this.applicationRepository = applicationRepository;
        this.candidateProfileService = candidateProfileService;
        this.jobService = jobService;
    }

    public Application applyForJob(
            Long candidateId,
            Long jobId,
            Application application,
            String authenticatedEmail) {

    	CandidateProfile candidate = candidateProfileService.findCandidateEntityById(candidateId);
        if (candidate.getUser() == null || !candidate.getUser().getEmail().equalsIgnoreCase(authenticatedEmail)) {
            throw new AccessDeniedException("Access Denied: You cannot submit an application on behalf of another candidate");
        }

    	Job job = jobService.findJobEntityById(jobId);

        if (applicationRepository.existsByCandidateProfileIdAndJobId(candidateId, jobId)) {
            throw new IllegalArgumentException("You have already applied for this job listing");
        }
    	
        Application newApplication = new Application();
        newApplication.setCandidateProfile(candidate);
        newApplication.setJob(job);
        newApplication.setStatus(ApplicationStatus.APPLIED);
        newApplication.setAppliedAt(LocalDateTime.now());
        newApplication.setUpdatedAt(LocalDateTime.now());

        return applicationRepository.save(newApplication);
    }

    public Application applyForJobByAuthenticatedCandidate(Long jobId, Application application, String authenticatedEmail) {
        CandidateProfile candidate = candidateProfileService.findCandidateEntityById(
                candidateProfileService.getCandidateByEmail(authenticatedEmail).getId()
        );
        return applyForJob(candidate.getId(), jobId, application, authenticatedEmail);
    }

    public List<ApplicationResponseDTO> getMyCandidateApplications(String authenticatedEmail) {
        List<Application> applications = applicationRepository.findByCandidateProfileUserEmail(authenticatedEmail);
        return applications.stream().map(this::mapToResponseDTO).toList();
    }

    public List<ApplicationResponseDTO> getMyRecruiterJobApplications(String authenticatedEmail) {
        List<Application> applications = applicationRepository.findByJobRecruiterUserEmail(authenticatedEmail);
        return applications.stream().map(this::mapToResponseDTO).toList();
    }

    public List<ApplicationResponseDTO> getApplicationsForJob(Long jobId, String authenticatedEmail) {
        jobService.verifyJobOwnership(jobId, authenticatedEmail);
        List<Application> applications = applicationRepository.findByJobId(jobId);
        return applications.stream().map(this::mapToResponseDTO).toList();
    }

    public List<ApplicationResponseDTO> getAllApplications() {
        List<Application> applications = applicationRepository.findAll();
        return applications.stream().map(this::mapToResponseDTO).toList();
    }

    public ApplicationResponseDTO getApplicationById(Long id, String authenticatedEmail) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        boolean isCandidateOwner = application.getCandidateProfile() != null && 
                                   application.getCandidateProfile().getUser() != null &&
                                   application.getCandidateProfile().getUser().getEmail().equalsIgnoreCase(authenticatedEmail);

        boolean isRecruiterOwner = application.getJob() != null &&
                                   application.getJob().getRecruiter() != null &&
                                   application.getJob().getRecruiter().getUser() != null &&
                                   application.getJob().getRecruiter().getUser().getEmail().equalsIgnoreCase(authenticatedEmail);

        if (!isCandidateOwner && !isRecruiterOwner) {
            throw new AccessDeniedException("Access Denied: You do not have permission to view this application");
        }

        return mapToResponseDTO(application);
    }

    public Application updateApplication(Long id, ApplicationStatus newStatus, String authenticatedEmail) {
        Application existingApplication = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        boolean isRecruiterOwner = existingApplication.getJob() != null &&
                                   existingApplication.getJob().getRecruiter() != null &&
                                   existingApplication.getJob().getRecruiter().getUser() != null &&
                                   existingApplication.getJob().getRecruiter().getUser().getEmail().equalsIgnoreCase(authenticatedEmail);

        if (!isRecruiterOwner) {
            throw new AccessDeniedException("Access Denied: Only the recruiter who posted this job can update application status");
        }

        existingApplication.setStatus(newStatus);
        existingApplication.setUpdatedAt(LocalDateTime.now());

        return applicationRepository.save(existingApplication);
    }

    public void deleteApplication(Long id, String authenticatedEmail) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));

        boolean isCandidateOwner = application.getCandidateProfile() != null && 
                                   application.getCandidateProfile().getUser() != null &&
                                   application.getCandidateProfile().getUser().getEmail().equalsIgnoreCase(authenticatedEmail);

        if (!isCandidateOwner) {
            throw new AccessDeniedException("Access Denied: Only the candidate who submitted this application can delete it");
        }

        applicationRepository.delete(application);
    }

    private ApplicationResponseDTO mapToResponseDTO(Application application) {
        ApplicationResponseDTO dto = new ApplicationResponseDTO();
        dto.setId(application.getId());
        dto.setAppliedAt(application.getAppliedAt());
        dto.setUpdatedAt(application.getUpdatedAt());

        if (application.getStatus() != null) {
            dto.setStatus(application.getStatus().name());
        } else {
            dto.setStatus("APPLIED");
        }

        if (application.getCandidateProfile() != null) {
            dto.setCandidateId(application.getCandidateProfile().getId());
            if (application.getCandidateProfile().getUser() != null) {
                dto.setCandidateName(application.getCandidateProfile().getUser().getName());
            } else {
                dto.setCandidateName("Unknown User Account");
            }
        }

        if (application.getJob() != null) {
            dto.setJobId(application.getJob().getId());
            dto.setJobTitle(application.getJob().getTitle());
            dto.setCompanyName(application.getJob().getCompanyName());
        }

        return dto;
    }
}