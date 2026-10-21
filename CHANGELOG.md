# TalentBridge Change Log

All notable changes to the TalentBridge full-stack application are documented in this file.

---

## [2026-09-07] - Backend Security, Ownership Protections & Full-Stack Completion

### Security
- **`User.java`**: Added `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)` to password field and `@PrePersist` / `@PreUpdate` timestamp hooks.
  - *Reason*: Passwords must never be serialized or leaked in HTTP JSON responses.
- **`JwtAuthenticationFilter.java`**: Implemented user loading from `UserRepository` and assigned `SimpleGrantedAuthority("ROLE_" + user.getRole().name())` into `SecurityContextHolder`.
  - *Reason*: Fixed critical authority mapping flaw where empty list was being set, breaking `@PreAuthorize` and `hasRole(...)` security rules.
- **`JwtService.java`**: Added `role` and `userId` claims to JWT generation and provided claim extraction methods.
  - *Reason*: Enables token role verification and client-side context initialization.
- **`SecurityConfig.java`**: Configured `CorsConfigurationSource` for cross-origin requests from Vite frontend (`http://localhost:5173`) and allowed public registration (`POST /candidates`, `POST /recruiters`) and job browsing (`GET /jobs`).
  - *Reason*: Prevented browser CORS blocks and permitted public user registration and job searching without pre-authentication.

### Backend (IDOR & Ownership Protections)
- **`JobService.java`**: Added `verifyJobOwnership(Long jobId, String authenticatedEmail)` to verify recruiter ownership before creating, updating, or deleting job listings. Added `getJobsByRecruiter(String authenticatedEmail)` and `createJobForAuthenticatedRecruiter`.
  - *Reason*: Prevented IDOR vulnerability where Recruiter A could modify or delete Recruiter B's job listing simply by changing the ID in URL.
- **`JobController.java`**: Updated endpoints with `Principal` parameters, `ResponseEntity` responses, and HTTP status codes (`201 CREATED`, `204 NO_CONTENT`, `200 OK`). Added `/my-jobs` route.
  - *Reason*: Provided REST-compliant HTTP status codes and enforced logged-in user ownership verification.
- **`CandidateProfileService.java` & `CandidateProfileController.java`**: Added candidate ownership validation (`verifyCandidateOwnership`), `getCandidateByEmail` lookup, and `/candidates/me` endpoint.
  - *Reason*: Prevented Candidate A from viewing or modifying Candidate B's profile.
- **`RecruiterProfileService.java` & `RecruiterProfileController.java`**: Added recruiter ownership validation (`verifyRecruiterOwnership`), fixed illegal `User user` method signature in `createRecruiterProfile`, and added `/recruiters/me` endpoint.
  - *Reason*: Fixed method binding bug and restricted recruiter profile modification to profile owners.
- **`ApplicationService.java` & `ApplicationController.java`**: Added duplicate application check (`existsByCandidateProfileIdAndJobId`), candidate ownership validation on submit/delete, recruiter ownership validation on application status updates, and custom queries (`getMyCandidateApplications`, `getMyRecruiterJobApplications`, `getApplicationsForJob`).
  - *Reason*: Enforced candidate and recruiter resource boundary rules and prevented duplicate job applications.
- **`GlobalExceptionHandler.java`**: Added handlers for `AccessDeniedException` (returns 403 Forbidden), `IllegalArgumentException` (returns 400 Bad Request), and `ResourceNotFoundException` (returns 404 Not Found).
  - *Reason*: Provided clear, secure, standardized HTTP status code responses without exposing sensitive internal trace details.
- **`ApplicationRepository.java`, `CandidateProfileRepository.java`, `RecruiterProfileRepository.java`, `JobRepository.java`**: Added custom query methods for user ID and email lookups.
  - *Reason*: Supported clean JPA repository lookups for ownership checks and profile resolution.

### Configuration
- **`application.properties`**: Updated database URL, username, password, and JWT secret to use environment variables with local defaults (`${DB_URL:...}`, `${DB_USERNAME:...}`, `${DB_PASSWORD:...}`, `${JWT_SECRET:...}`).
  - *Reason*: Enabled seamless production deployment without hardcoded secrets or environment mismatch.

### Frontend
- **`frontend/` (React + Vite App)**: Scaffolded modern React Vite project.
  - *Reason*: Created missing client-side application using standard lightweight technologies.
- **`frontend/src/index.css`**: Built Vanilla CSS design system featuring Glassmorphism, HSL dark mode palettes, glowing accent buttons, and responsive grid layouts.
  - *Reason*: Delivered a visual experience for candidates and recruiters.
- **`frontend/src/services/api.js`**: Centralized API service matching backend endpoints, DTO structures, and Bearer token headers.
  - *Reason*: Established clean, decoupled, non-duplicated API integration layer.
- **`frontend/src/context/AuthContext.jsx`**: Auth state provider handling JWT storage in `localStorage`, role detection (`isCandidate`, `isRecruiter`), login, and logout.
  - *Reason*: Managed persistent frontend authentication state.
- **`frontend/src/pages/LandingPage.jsx`**: Public landing page with hero banner and role action buttons.
  - *Reason*: Entry point highlighting platform features.
- **`frontend/src/pages/JobListingsPage.jsx`**: Real-time job search, filter by title/skills/location, job details modal, and 1-click candidate apply.
  - *Reason*: Public job browsing interface connected to live backend APIs.
- **`frontend/src/pages/LoginPage.jsx`**: Sign-in form with error feedback.
  - *Reason*: User authentication interface.
- **`frontend/src/pages/RegisterCandidatePage.jsx` & `RegisterRecruiterPage.jsx`**: Registration forms for candidates and recruiters with client-side validation.
  - *Reason*: Dedicated onboarding flows for candidate and recruiter roles.
- **`frontend/src/pages/CandidateDashboard.jsx`**: Candidate profile editor and application tracking history with status badges (`APPLIED`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`).
  - *Reason*: Self-service portal for candidates.
- **`frontend/src/pages/RecruiterDashboard.jsx`**: Recruiter profile editor, job manager (create/edit/delete modals), and candidate applicant status manager.
  - *Reason*: Command center for recruiters.

### Testing
- **`SecurityIntegrationTests.java`**: Created comprehensive Spring Boot integration test suite covering Candidate/Recruiter registration, JWT auth, password secrecy, role rules, and IDOR ownership isolation (Recruiter B cannot edit/delete Recruiter A's job; Candidate 2 cannot view Candidate 1's profile).
  - *Reason*: Verified backend correctness and security guarantees (Build & Test Success).
