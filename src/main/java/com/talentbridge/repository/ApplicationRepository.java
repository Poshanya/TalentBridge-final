package com.talentbridge.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.talentbridge.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateProfileId(Long candidateId);
    List<Application> findByCandidateProfileUserEmail(String email);
    List<Application> findByJobRecruiterId(Long recruiterId);
    List<Application> findByJobRecruiterUserEmail(String email);
    List<Application> findByJobId(Long jobId);
    boolean existsByCandidateProfileIdAndJobId(Long candidateId, Long jobId);
}

