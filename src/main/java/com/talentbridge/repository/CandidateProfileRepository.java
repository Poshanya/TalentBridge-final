package com.talentbridge.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.talentbridge.entity.CandidateProfile;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
    Optional<CandidateProfile> findByUserId(Long userId);
    Optional<CandidateProfile> findByUserEmail(String email);
}

