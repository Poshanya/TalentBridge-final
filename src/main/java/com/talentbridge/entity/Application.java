package com.talentbridge.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "application", uniqueConstraints = {
    @UniqueConstraint(name = "uk_application_candidate_job", columnNames = {"candidate_profile_id", "job_id"})
})
@Getter
@Setter
public class Application {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Enumerated(EnumType.STRING)
	private ApplicationStatus status; // Changed from String to ApplicationStatus

	private LocalDateTime appliedAt;
	private LocalDateTime updatedAt;
		
	@PrePersist
	protected void onCreate() {
		appliedAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}

	@ManyToOne(optional = false)
    @JoinColumn(name = "candidate_profile_id", nullable = false)
	private CandidateProfile candidateProfile;
	
	@ManyToOne(optional = false)
    @JoinColumn(name = "job_id", nullable = false)
	private Job job;
	
	public Application() {
	}
}

