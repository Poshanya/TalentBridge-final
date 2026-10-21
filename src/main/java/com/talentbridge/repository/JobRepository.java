package com.talentbridge.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.talentbridge.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterId(Long recruiterId);
    List<Job> findByRecruiterUserEmail(String email);
}

