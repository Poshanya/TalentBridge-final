package com.talentbridge.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.talentbridge.dto.JobRequestDTO;
import com.talentbridge.dto.JobResponseDTO;
import com.talentbridge.dto.JobUpdateRequestDTO;
import com.talentbridge.entity.Job;
import com.talentbridge.entity.RecruiterProfile;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.repository.JobRepository;

@Service	
public class JobService {

	private final JobRepository jobRepository;
	private final RecruiterProfileService recruiterProfileService;
	
	public JobService(JobRepository jobRepository, RecruiterProfileService recruiterProfileService) {
		this.recruiterProfileService = recruiterProfileService;
		this.jobRepository = jobRepository;
	}
	
	public Job createJob(Long recruiterId, JobRequestDTO jobDto, String authenticatedEmail) {
		RecruiterProfile recruiter = recruiterProfileService.findRecruiterEntityById(recruiterId);
		if (recruiter.getUser() == null || !recruiter.getUser().getEmail().equalsIgnoreCase(authenticatedEmail)) {
			throw new AccessDeniedException("Access Denied: You cannot create jobs on behalf of another recruiter");
		}

	    Job newJob = new Job();
	    newJob.setTitle(jobDto.getTitle());
	    newJob.setCompanyName(jobDto.getCompanyName());
	    newJob.setDescription(jobDto.getDescription());
	    newJob.setSkills(jobDto.getSkills());
	    newJob.setLocation(jobDto.getLocation());
	    newJob.setSalary(jobDto.getSalary());

	    newJob.setRecruiter(recruiter);
	    newJob.setCreatedAt(LocalDateTime.now());
	    newJob.setUpdatedAt(LocalDateTime.now());

	    return jobRepository.save(newJob);
	}

	public Job createJobForAuthenticatedRecruiter(JobRequestDTO jobDto, String authenticatedEmail) {
		RecruiterProfile recruiter = recruiterProfileService.findRecruiterEntityByEmail(authenticatedEmail);
		return createJob(recruiter.getId(), jobDto, authenticatedEmail);
	}

	public void verifyJobOwnership(Long jobId, String authenticatedEmail) {
		Job job = jobRepository.findById(jobId)
				.orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
		if (job.getRecruiter() == null || job.getRecruiter().getUser() == null || 
			!job.getRecruiter().getUser().getEmail().equalsIgnoreCase(authenticatedEmail)) {
			throw new AccessDeniedException("Access Denied: You do not own this job listing");
		}
	}

	public Job updateJob(Long id, JobUpdateRequestDTO updatedJobDto, String authenticatedEmail) {
		verifyJobOwnership(id, authenticatedEmail);
	    Job existingJob = jobRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

	    existingJob.setTitle(updatedJobDto.getTitle());
	    existingJob.setCompanyName(updatedJobDto.getCompanyName());
	    existingJob.setDescription(updatedJobDto.getDescription());
	    existingJob.setLocation(updatedJobDto.getLocation());
	    existingJob.setSalary(updatedJobDto.getSalary());
	    existingJob.setSkills(updatedJobDto.getSkills());

	    existingJob.setUpdatedAt(LocalDateTime.now());

	    return jobRepository.save(existingJob);
	}
	
	public void deleteJob(Long id, String authenticatedEmail) {
		verifyJobOwnership(id, authenticatedEmail);
		Job deletejob = jobRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
		jobRepository.delete(deletejob);
	}
	
	public List<JobResponseDTO> getAllJobs() {
	    List<Job> jobs = jobRepository.findAll();
	    return jobs.stream().map(this::mapToDTO).toList();
	}

	public List<JobResponseDTO> getJobsByRecruiter(String authenticatedEmail) {
		List<Job> jobs = jobRepository.findByRecruiterUserEmail(authenticatedEmail);
		return jobs.stream().map(this::mapToDTO).toList();
	}
	
	public JobResponseDTO getJobById(Long id) {
	    Job job = jobRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
	    return mapToDTO(job);
	}
	
	public Job findJobEntityById(Long id) {
	    return jobRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
	}

	private JobResponseDTO mapToDTO(Job job) {
		JobResponseDTO dto = new JobResponseDTO();
		dto.setId(job.getId());
		dto.setTitle(job.getTitle());
		dto.setCompanyName(job.getCompanyName());
		dto.setDescription(job.getDescription());
		dto.setLocation(job.getLocation());
		dto.setSalary(job.getSalary());
		dto.setSkills(job.getSkills());

		if (job.getRecruiter() != null) {
			dto.setRecruiterId(job.getRecruiter().getId());
			if (job.getRecruiter().getUser() != null) {
				dto.setRecruiterName(job.getRecruiter().getUser().getName());
			}
		}

		dto.setCreatedAt(job.getCreatedAt());
		dto.setUpdatedAt(job.getUpdatedAt());

		return dto;
	}
}

