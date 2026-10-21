package com.talentbridge.security;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.talentbridge.dto.*;
import com.talentbridge.entity.*;
import com.talentbridge.repository.*;
import com.talentbridge.service.*;

@SpringBootTest
@Transactional
public class SecurityIntegrationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private CandidateProfileService candidateProfileService;

    @Autowired
    private RecruiterProfileService recruiterProfileService;

    @Autowired
    private JobService jobService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testCandidateAndRecruiterRegistrationAndAuth() {
        // 1. Candidate Registration
        User u1 = new User();
        u1.setName("Alice Candidate");
        u1.setEmail("alice@test.com");
        u1.setPassword("Password123");

        CandidateProfile cp1 = new CandidateProfile();
        cp1.setPhone("1234567890");
        cp1.setLocation("NY");
        cp1.setEducation("BS");
        cp1.setExperience("2 yrs");
        cp1.setSkills("Java, React");

        CandidateProfile savedCp = candidateProfileService.createCandidate(u1, cp1);
        assertNotNull(savedCp.getId());
        assertEquals(Role.CANDIDATE, savedCp.getUser().getRole());
        assertTrue(passwordEncoder.matches("Password123", savedCp.getUser().getPassword()));

        // 2. Recruiter Registration
        User u2 = new User();
        u2.setName("Bob Recruiter");
        u2.setEmail("bob@test.com");
        u2.setPassword("Password123");

        RecruiterProfile rp1 = new RecruiterProfile();
        rp1.setCompanyName("TechCorp");
        rp1.setLocation("SF");
        rp1.setDesignation("Lead Recruiter");
        rp1.setPhone("0987654321");

        RecruiterProfile savedRp = recruiterProfileService.createRecruiter(u2, rp1);
        assertNotNull(savedRp.getId());
        assertEquals(Role.RECRUITER, savedRp.getUser().getRole());

        // 3. Login Test & JWT
        LoginRequestDTO loginReq = new LoginRequestDTO();
        loginReq.setEmail("alice@test.com");
        loginReq.setPassword("Password123");

        LoginResponseDTO loginRes = authService.login(loginReq);
        assertNotNull(loginRes.getToken());
        assertEquals("alice@test.com", loginRes.getEmail());
        assertEquals(Role.CANDIDATE, loginRes.getRole());

        String extractedEmail = jwtService.extractEmail(loginRes.getToken());
        assertEquals("alice@test.com", extractedEmail);
    }

    @Test
    void testRecruiterJobOwnershipRestriction() {
        // Recruiter A
        User uA = new User();
        uA.setName("Recruiter A");
        uA.setEmail("recruiterA@company.com");
        uA.setPassword("Password123");
        RecruiterProfile rpA = new RecruiterProfile();
        rpA.setCompanyName("Company A");
        rpA.setLocation("NYC");
        rpA.setDesignation("HR");
        rpA.setPhone("1111111111");
        RecruiterProfile savedA = recruiterProfileService.createRecruiter(uA, rpA);

        // Recruiter B
        User uB = new User();
        uB.setName("Recruiter B");
        uB.setEmail("recruiterB@company.com");
        uB.setPassword("Password123");
        RecruiterProfile rpB = new RecruiterProfile();
        rpB.setCompanyName("Company B");
        rpB.setLocation("SFO");
        rpB.setDesignation("HR");
        rpB.setPhone("2222222222");
        RecruiterProfile savedB = recruiterProfileService.createRecruiter(uB, rpB);

        // Recruiter A creates a job
        JobRequestDTO jobDto = new JobRequestDTO();
        jobDto.setTitle("Java Developer");
        jobDto.setCompanyName("Company A");
        jobDto.setDescription("Dev role");
        jobDto.setLocation("NYC");
        jobDto.setSalary(120000);
        jobDto.setSkills("Java");

        Job jobA = jobService.createJob(savedA.getId(), jobDto, "recruiterA@company.com");
        assertNotNull(jobA.getId());

        // Recruiter B attempts to update Recruiter A's job -> MUST FAIL WITH AccessDeniedException
        JobUpdateRequestDTO updateDto = new JobUpdateRequestDTO();
        updateDto.setTitle("Hacked Title");
        updateDto.setCompanyName("Hacked Corp");
        updateDto.setDescription("Hacked");
        updateDto.setLocation("NYC");
        updateDto.setSalary(150000);
        updateDto.setSkills("Hacking");

        assertThrows(AccessDeniedException.class, () -> {
            jobService.updateJob(jobA.getId(), updateDto, "recruiterB@company.com");
        });

        // Recruiter B attempts to delete Recruiter A's job -> MUST FAIL WITH AccessDeniedException
        assertThrows(AccessDeniedException.class, () -> {
            jobService.deleteJob(jobA.getId(), "recruiterB@company.com");
        });
    }

    @Test
    void testCandidateProfileOwnershipRestriction() {
        // Candidate 1
        User u1 = new User();
        u1.setName("Candidate One");
        u1.setEmail("cand1@test.com");
        u1.setPassword("Password123");
        CandidateProfile cp1 = new CandidateProfile();
        cp1.setPhone("1111111111");
        cp1.setLocation("Boston");
        cp1.setEducation("BS");
        cp1.setExperience("1 yr");
        cp1.setSkills("Python");
        CandidateProfile saved1 = candidateProfileService.createCandidate(u1, cp1);

        // Candidate 2 attempts to get Candidate 1's profile -> MUST FAIL WITH AccessDeniedException
        assertThrows(AccessDeniedException.class, () -> {
            candidateProfileService.getCandidateById(saved1.getId(), "cand2@test.com");
        });
    }
}
