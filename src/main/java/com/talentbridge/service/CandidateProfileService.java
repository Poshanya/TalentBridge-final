package com.talentbridge.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.talentbridge.dto.CandidateResponseDTO;
import com.talentbridge.dto.CandidateUpdateRequestDTO;
import com.talentbridge.entity.CandidateProfile;
import com.talentbridge.entity.Role;
import com.talentbridge.entity.User;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.repository.CandidateProfileRepository;

@Service
public class CandidateProfileService {

	private final CandidateProfileRepository candidateProfileRepository;
	private final UserService userService;
	
	public CandidateProfileService(CandidateProfileRepository candidateProfileRepository, UserService userService) {
		this.candidateProfileRepository = candidateProfileRepository;
		this.userService = userService;
	}
	
	public CandidateProfile createCandidate(
	        User user,
	        CandidateProfile candidateProfile) {

	    user.setRole(Role.CANDIDATE);

	    User savedUser = userService.addUser(user);

	    CandidateProfile newProfile = new CandidateProfile();

	    newProfile.setUser(savedUser);
	    newProfile.setPhone(candidateProfile.getPhone());
	    newProfile.setLocation(candidateProfile.getLocation());
	    newProfile.setEducation(candidateProfile.getEducation());
	    newProfile.setExperience(candidateProfile.getExperience());
	    newProfile.setSkills(candidateProfile.getSkills());

	    return candidateProfileRepository.save(newProfile);
	}

	public void verifyCandidateOwnership(Long profileId, String authenticatedEmail) {
		CandidateProfile profile = candidateProfileRepository.findById(profileId)
				.orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + profileId));
		if (profile.getUser() == null || !profile.getUser().getEmail().equalsIgnoreCase(authenticatedEmail)) {
			throw new AccessDeniedException("Access Denied: You do not have permission to access or modify another candidate's profile");
		}
	}
	
	public CandidateProfile updatedCandidate(Long id, CandidateUpdateRequestDTO updatedProfile, String authenticatedEmail) {
		verifyCandidateOwnership(id, authenticatedEmail);
		CandidateProfile existingProfile = candidateProfileRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
		existingProfile.setPhone(updatedProfile.getPhone());
		existingProfile.setLocation(updatedProfile.getLocation());
		existingProfile.setEducation(updatedProfile.getEducation());
		existingProfile.setExperience(updatedProfile.getExperience());
		existingProfile.setSkills(updatedProfile.getSkills());
		return candidateProfileRepository.save(existingProfile);
	}
	
	public void deleteCandidate(Long id, String authenticatedEmail) {
		verifyCandidateOwnership(id, authenticatedEmail);
	    CandidateProfile candidateProfile = candidateProfileRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));

	    User user = candidateProfile.getUser();
	    candidateProfileRepository.delete(candidateProfile);
	    userService.deleteUser(user.getId());
	}
	
	public CandidateResponseDTO getCandidateById(Long id, String authenticatedEmail) {
		verifyCandidateOwnership(id, authenticatedEmail);
	    CandidateProfile candidateProfile = candidateProfileRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));

	    return mapToResponseDTO(candidateProfile);
	}

	public CandidateResponseDTO getCandidateByEmail(String authenticatedEmail) {
		CandidateProfile candidateProfile = candidateProfileRepository.findByUserEmail(authenticatedEmail)
				.orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found for user: " + authenticatedEmail));
		return mapToResponseDTO(candidateProfile);
	}
	
	public List<CandidateResponseDTO> getALLCandidates() {
	    List<CandidateProfile> candidates = candidateProfileRepository.findAll();
	    return candidates.stream().map(this::mapToResponseDTO).toList();
	}
	
	public CandidateProfile findCandidateEntityById(Long id) {
	    return candidateProfileRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
	}

	private CandidateResponseDTO mapToResponseDTO(CandidateProfile candidateProfile) {
		User user = candidateProfile.getUser();
		CandidateResponseDTO dto = new CandidateResponseDTO();
		dto.setId(candidateProfile.getId());
		if (user != null) {
			dto.setName(user.getName());
			dto.setEmail(user.getEmail());
			dto.setRole(user.getRole());
			dto.setCreated_at(user.getCreated_at());
			dto.setUpdated_at(user.getUpdated_at());
		}
		dto.setPhone(candidateProfile.getPhone());
		dto.setLocation(candidateProfile.getLocation());
		dto.setEducation(candidateProfile.getEducation());
		dto.setExperience(candidateProfile.getExperience());
		dto.setSkills(candidateProfile.getSkills());
		return dto;
	}
}


