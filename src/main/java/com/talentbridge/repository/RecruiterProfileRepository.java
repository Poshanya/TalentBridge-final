package com.talentbridge.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.talentbridge.entity.RecruiterProfile;

public interface RecruiterProfileRepository extends JpaRepository<RecruiterProfile, Long> {
    Optional<RecruiterProfile> findByUserId(Long userId);
    Optional<RecruiterProfile> findByUserEmail(String email);
}

