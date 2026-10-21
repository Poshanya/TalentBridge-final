import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, UserCheck } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage }) => {
  const { user, isAuthenticated, isCandidate, isRecruiter, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="nav-container">
        <a 
          href="#" 
          className="logo" 
          onClick={(e) => { e.preventDefault(); setActivePage('landing'); }}
        >
          <Briefcase style={{ width: 20, height: 20, color: 'var(--brand-navy)' }} />
          <span>Talent<span style={{ color: 'var(--brand-blue)' }}>Bridge</span></span>
          <span className="logo-badge">RECRUITMENT</span>
        </a>

        <ul className="nav-links">
          <li>
            <span 
              className={`nav-link ${activePage === 'jobs' ? 'active' : ''}`}
              onClick={() => setActivePage('jobs')}
            >
              Browse Jobs
            </span>
          </li>

          {isAuthenticated ? (
            <>
              {isCandidate && (
                <li>
                  <span 
                    className={`nav-link ${activePage === 'candidate-dashboard' ? 'active' : ''}`}
                    onClick={() => setActivePage('candidate-dashboard')}
                  >
                    Candidate Dashboard
                  </span>
                </li>
              )}

              {isRecruiter && (
                <li>
                  <span 
                    className={`nav-link ${activePage === 'recruiter-dashboard' ? 'active' : ''}`}
                    onClick={() => setActivePage('recruiter-dashboard')}
                  >
                    Recruiter Dashboard
                  </span>
                </li>
              )}

              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <span className={`badge ${isCandidate ? 'badge-candidate' : 'badge-recruiter'}`}>
                  <UserCheck style={{ width: 12, height: 12 }} />
                  {user?.role}
                </span>

                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user?.name}
                </span>

                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => { logout(); setActivePage('landing'); }}
                >
                  <LogOut style={{ width: 14, height: 14 }} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setActivePage('login')}
                >
                  Sign In
                </button>
              </li>
              <li>
                <button 
                  className="btn btn-primary btn-sm" 
                  onClick={() => setActivePage('register-candidate')}
                >
                  Candidate Register
                </button>
              </li>
              <li>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setActivePage('register-recruiter')}
                >
                  Recruiter Register
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};
