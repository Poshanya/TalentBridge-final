import React from 'react';
import { Briefcase, Building2, Users, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage = ({ setActivePage }) => {
  const { isAuthenticated, isCandidate, isRecruiter } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Header Section */}
      <section className="panel" style={{ padding: '2.5rem 2rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div className="badge badge-candidate" style={{ marginBottom: '1rem' }}>
            TalentBridge Job Portal
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, letterSpacing: '-0.4px' }}>
            Professional Recruitment Platform for Tech Candidates and Hiring Managers
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.85rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Streamlined job discovery for software engineers with direct recruiter management and real-time application tracking.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setActivePage('jobs')}>
              <Briefcase style={{ width: 16, height: 16 }} />
              Browse Open Jobs
            </button>

            {!isAuthenticated && (
              <>
                <button className="btn btn-secondary" onClick={() => setActivePage('register-candidate')}>
                  <Users style={{ width: 16, height: 16 }} />
                  Candidate Registration
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setActivePage('register-recruiter')}
                >
                  <Building2 style={{ width: 16, height: 16 }} />
                  Recruiter Portal
                </button>
              </>
            )}

            {isAuthenticated && isCandidate && (
              <button className="btn btn-secondary" onClick={() => setActivePage('candidate-dashboard')}>
                Go to Candidate Dashboard <ArrowRight style={{ width: 15, height: 15 }} />
              </button>
            )}

            {isAuthenticated && isRecruiter && (
              <button className="btn btn-secondary" onClick={() => setActivePage('recruiter-dashboard')}>
                Go to Recruiter Dashboard <ArrowRight style={{ width: 15, height: 15 }} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="grid-cols-3">
        <div className="panel panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <ShieldCheck style={{ width: 20, height: 20 }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Secure Role-Based Access</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            JWT authentication ensuring candidates and hiring managers securely access only their authorized profile and job data.
          </p>
        </div>

        <div className="panel panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <Briefcase style={{ width: 20, height: 20 }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Application Tracking</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Candidates submit direct applications and track status updates (Applied, Shortlisted, Accepted, Rejected) in real time.
          </p>
        </div>

        <div className="panel panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <Building2 style={{ width: 20, height: 20 }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Recruiter Management</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Recruiters publish job openings, review candidate qualifications, and update application progression seamlessly.
          </p>
        </div>
      </section>

      {/* Role Overview Comparison */}
      <section className="grid-cols-2">
        <div className="panel panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>For Candidates</h3>
            <span className="badge badge-candidate">Candidate</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--brand-blue)' }} />
              Browse verified full-time tech openings
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--brand-blue)' }} />
              Manage profile, education, skills & experience
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--brand-blue)' }} />
              Monitor application review stages
            </li>
          </ul>
          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('register-candidate')}>
              Register as Candidate
            </button>
          </div>
        </div>

        <div className="panel panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>For Recruiters & Employers</h3>
            <span className="badge badge-recruiter">Recruiter</span>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: '#15803d' }} />
              Post new job positions with salary and skill tags
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: '#15803d' }} />
              Edit or remove active company job listings
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 style={{ width: 16, height: 16, color: '#15803d' }} />
              Review candidate applicants and assign candidate status
            </li>
          </ul>
          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('register-recruiter')}>
              Register as Recruiter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
