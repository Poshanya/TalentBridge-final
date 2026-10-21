package com.talentbridge.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.talentbridge.dto.RecruiterResponseDTO;
import com.talentbridge.dto.RecruiterUpdateRequestDTO;
import com.talentbridge.entity.RecruiterProfile;
import com.talentbridge.entity.Role;
import com.talentbridge.entity.User;
import com.talentbridge.exception.ResourceNotFoundException;
import com.talentbridge.repository.RecruiterProfileRepository;

@Service
public class RecruiterProfileService {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserService userService;

    public RecruiterProfileService(
            RecruiterProfileRepository recruiterProfileRepository,
            UserService userService) {

        this.recruiterProfileRepository = recruiterProfileRepository;
        this.userService = userService;
    }

    public RecruiterProfile createRecruiter(
            User user,
            RecruiterProfile recruiterProfile) {

        user.setRole(Role.RECRUITER);

        User savedUser = userService.addUser(user);

        RecruiterProfile newProfile = new RecruiterProfile();

        newProfile.setUser(savedUser);
        newProfile.setCompanyName(recruiterProfile.getCompanyName());
        newProfile.setLocation(recruiterProfile.getLocation());
        newProfile.setDesignation(recruiterProfile.getDesignation());
        newProfile.setPhone(recruiterProfile.getPhone());
        newProfile.setRole(Role.RECRUITER);

        return recruiterProfileRepository.save(newProfile);
    }

    public void verifyRecruiterOwnership(Long profileId, String authenticatedEmail) {
        RecruiterProfile profile = recruiterProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + profileId));
        if (profile.getUser() == null || !profile.getUser().getEmail().equalsIgnoreCase(authenticatedEmail)) {
            throw new AccessDeniedException("Access Denied: You do not have permission to access or modify another recruiter's profile");
        }
    }
    
    public RecruiterResponseDTO getRecruiterById(Long id, String authenticatedEmail) {
        verifyRecruiterOwnership(id, authenticatedEmail);
        RecruiterProfile recruiterProfile = recruiterProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + id));

        return mapToResponseDTO(recruiterProfile);
    }

    public RecruiterResponseDTO getRecruiterByEmail(String authenticatedEmail) {
        RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUserEmail(authenticatedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for user: " + authenticatedEmail));
        return mapToResponseDTO(recruiterProfile);
    }

    public RecruiterProfile updateRecruiter(
            Long id,
            RecruiterUpdateRequestDTO updatedProfile,
            String authenticatedEmail) {

        verifyRecruiterOwnership(id, authenticatedEmail);
        RecruiterProfile existingProfile = recruiterProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + id));

        existingProfile.setCompanyName(updatedProfile.getCompanyName());
        existingProfile.setLocation(updatedProfile.getLocation());
        existingProfile.setDesignation(updatedProfile.getDesignation());
        existingProfile.setPhone(updatedProfile.getPhone());

        return recruiterProfileRepository.save(existingProfile);
    }

    public void deleteRecruiter(Long id, String authenticatedEmail) {
        verifyRecruiterOwnership(id, authenticatedEmail);
        RecruiterProfile recruiterProfile = recruiterProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + id));

        User user = recruiterProfile.getUser();
        recruiterProfileRepository.delete(recruiterProfile);
        userService.deleteUser(user.getId());
    }

    public List<RecruiterResponseDTO> getAllRecruiters() {
        List<RecruiterProfile> recruiters = recruiterProfileRepository.findAll();
        return recruiters.stream().map(this::mapToResponseDTO).toList();
    }

    public RecruiterProfile findRecruiterEntityById(Long id) {
        return recruiterProfileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with id: " + id));
    }

    public RecruiterProfile findRecruiterEntityByEmail(String email) {
        return recruiterProfileRepository.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter profile not found for user: " + email));
    }

    private RecruiterResponseDTO mapToResponseDTO(RecruiterProfile recruiterProfile) {
        User user = recruiterProfile.getUser();
        RecruiterResponseDTO dto = new RecruiterResponseDTO();
        dto.setId(recruiterProfile.getId());
        if (user != null) {
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
        }
        dto.setCompanyName(recruiterProfile.getCompanyName());
        dto.setLocation(recruiterProfile.getLocation());
        dto.setDesignation(recruiterProfile.getDesignation());
        dto.setPhone(recruiterProfile.getPhone());
        dto.setCreated_at(recruiterProfile.getCreatedAt());
        dto.setUpdated_at(recruiterProfile.getUpdatedAt());
        return dto;
    }
}