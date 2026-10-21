# TalentBridge - Full-Stack Job Portal Application

TalentBridge is a modern, high-performance, full-stack job portal web application that connects candidates looking for tech opportunities with recruiters seeking top talent. It features Spring Security JWT authentication, granular role-based authorization (`ROLE_CANDIDATE` and `ROLE_RECRUITER`), strict resource ownership checks (preventing IDOR vulnerabilities), and a responsive React + Vite dark mode interface.

---

## 🚀 Key Features

### Candidate Capabilities
- **Registration & Authentication**: Quick registration with validation (10-digit phone verification, min 8-character password hashing via BCrypt).
- **Profile Management**: View and update candidate skills, location, education, and work experience.
- **Job Discovery & Search**: Filter jobs by keyword, company, skills, or location. View full job modal details.
- **1-Click Application**: Apply directly for open positions with duplicate application prevention.
- **Application Tracking**: Monitor real-time status (`APPLIED`, `SHORTLISTED`, `ACCEPTED`, `REJECTED`).

### Recruiter Capabilities
- **Company Registration**: Dedicated recruiter sign-up with company name, designation, and contact details.
- **Recruiter Profile Management**: View and update corporate recruiter details.
- **Job Management (CRUD)**: Create, edit, and delete job postings.
- **Applicant Review**: View candidate applications submitted specifically for recruiter's job listings.
- **Status Workflow**: Update applicant status (`APPLIED` → `SHORTLISTED` → `ACCEPTED` / `REJECTED`).

### Security & Architecture Highlights
- **Stateless JWT Authentication**: 24-hour expiration token containing user claims.
- **Role-Based Access Control (RBAC)**: Enforces endpoints restricted to `ROLE_CANDIDATE` and `ROLE_RECRUITER`.
- **IDOR Protection & Ownership Validation**: 
  - Recruiter A **cannot** edit or delete Recruiter B's job listing.
  - Recruiter A **cannot** manage applications for Recruiter B's jobs.
  - Candidate A **cannot** access or modify Candidate B's profile or applications.
- **Data Privacy**: Passwords are hashed using BCrypt and annotated with `@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)` to guarantee zero exposure in API responses.
- **CORS Configured**: Configured for Vite frontend integration (`http://localhost:5173`).

---

## 🛠️ Technologies Used

### Backend
- **Java 17**
- **Spring Boot 3.2.4**
- **Spring Security & JJWT (0.12.6)**
- **Spring Data JPA & Hibernate**
- **MySQL / Relational Database**
- **Jakarta Validation (`@Valid`, `@NotBlank`, `@Email`, `@Pattern`, `@Positive`)**
- **Lombok**

### Frontend
- **React 19 & Vite**
- **Vanilla CSS3 (Design System with Glassmorphism & HSL tailoring)**
- **Lucide React Icons**
- **Context API for Auth & JWT Management**

---

## ⚙️ Environment Variables

Sensitive production properties are externalized in `src/main/resources/application.properties`:

| Variable Name | Description | Default Fallback Value |
|---|---|---|
| `DB_URL` | MySQL JDBC Database Connection URL | `jdbc:mysql://localhost:3306/talentbridge` |
| `DB_USERNAME` | Database User | `root` |
| `DB_PASSWORD` | Database Password | `your_database_password` |
| `JWT_SECRET` | Base64-encoded Secret Key for HMAC-SHA | `your_base64_encoded_secret` |
| `VITE_API_URL` | Frontend Environment variable for Backend API | `http://localhost:8080` |

---

## 📂 Project Architecture & Endpoint Reference

### Authentication Endpoints
- `POST /auth/login` - Public login endpoint returning JWT token and user role.

### Candidate Endpoints
- `POST /candidates` - Public candidate registration.
- `GET /candidates/me` - Authenticated candidate profile lookup.
- `GET /candidates/{id}` - Get profile by ID (Owner only).
- `PUT /candidates/{id}` - Update profile (Owner only).
- `DELETE /candidates/{id}` - Delete profile (Owner only).

### Recruiter Endpoints
- `POST /recruiters` - Public recruiter registration.
- `GET /recruiters/me` - Authenticated recruiter profile lookup.
- `GET /recruiters/{id}` - Get profile by ID (Owner only).
- `PUT /recruiters/{id}` - Update profile (Owner only).
- `DELETE /recruiters/{id}` - Delete profile (Owner only).

### Job Endpoints
- `GET /jobs` - Public job listings browsing.
- `GET /jobs/{id}` - Public job details view.
- `GET /jobs/my-jobs` - Recruiter's posted jobs.
- `POST /jobs` / `POST /jobs/recruiter/{recruiterId}` - Create job (Recruiter only, ownership checked).
- `PUT /jobs/{id}` - Update job (Owner Recruiter only).
- `DELETE /jobs/{id}` - Delete job (Owner Recruiter only).

### Application Endpoints
- `POST /applications/job/{jobId}` - Submit job application (Candidate only).
- `GET /applications/my-applications` - Candidate's application history.
- `GET /applications/recruiter-jobs` - Applications submitted for recruiter's jobs.
- `GET /applications/job/{jobId}` - Applications for a specific job (Owner Recruiter only).
- `GET /applications/{id}` - View application (Candidate owner or Recruiter owner).
- `PUT /applications/{id}` - Update application status (Owner Recruiter only).
- `DELETE /applications/{id}` - Withdraw application (Candidate owner only).

---

## 🏃 Local Setup & Running Instructions

### 1. Database Setup
Ensure MySQL server is running locally and create the database:
```sql
CREATE DATABASE talentbridge;
```

### 2. Backend Startup
From the project root:
```bash
# Build and run using Maven Wrapper
./mvnw.cmd spring-boot:run
```
The backend server starts at `http://localhost:8080`.

### 3. Frontend Startup
Open a separate terminal window and navigate to the `frontend/` folder:
```bash
cd frontend
npm install
npm run dev
```
The Vite development server runs at `http://localhost:5173`.

---

## 🚢 Production Deployment

### Backend Deployment (Docker / Cloud App Service / AWS Elastic Beanstalk)
1. Set production environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`).
2. Build JAR artifact:
   ```bash
   ./mvnw.cmd clean package -DskipTests
   ```
3. Run executable package:
   ```bash
   java -jar target/Talent-Bridge-0.0.1-SNAPSHOT.jar
   ```

### Frontend Deployment (Vercel / Netlify / Nginx)
1. Build static production bundle:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy contents of `frontend/dist` directory to your static hosting provider or Nginx server.
