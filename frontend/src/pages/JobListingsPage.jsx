import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { Search, MapPin, Building2, Send } from 'lucide-react';

export const JobListingsPage = ({ setActivePage, navigate }) => {
  const { isAuthenticated, isCandidate } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [applyingJobId, setApplyingJobId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getAllJobs();
        if (!cancelled) setJobs(data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load job listings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleApply = async (e, jobId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      if (navigate) navigate('/login');
      else setActivePage('login');
      return;
    }

    if (!isCandidate) {
      setError('Only Candidate accounts can apply for jobs');
      return;
    }

    setApplyingJobId(jobId);
    setError('');
    setSuccess('');

    try {
      await api.applyForJob(jobId);
      setSuccess('Application submitted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleViewDetails = (jobId) => {
    if (navigate) {
      navigate(`/jobs/${jobId}`);
    } else {
      setActivePage(`/jobs/${jobId}`);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const query = searchQuery.toLowerCase();
    return (
      job.title?.toLowerCase().includes(query) ||
      job.companyName?.toLowerCase().includes(query) ||
      job.skills?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Explore Job Opportunities</h1>
        <p className="page-subtitle">Find tech roles and apply directly with company recruiters</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* Search Input Bar */}
      <div className="panel panel-body" style={{ padding: '0.85rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search style={{ color: 'var(--text-muted)', width: 18, height: 18, flexShrink: 0 }} />
          <input 
            type="text"
            className="form-input"
            placeholder="Search by job title, company name, required skills, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', padding: '0.25rem 0', boxShadow: 'none' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p>Loading open job positions...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No matching jobs found</h3>
          <p>Try refining your search terms or view all open positions.</p>
          {searchQuery && (
            <button className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }} onClick={() => setSearchQuery('')}>
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="grid-cols-2">
          {filteredJobs.map(job => (
            <div 
              key={job.id} 
              className="panel panel-body" 
              style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', cursor: 'pointer' }}
              onClick={() => handleViewDetails(job.id)}
            >
              {/* Job Title & Company */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <h3 
                    style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}
                  >
                    {job.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--brand-blue)', fontSize: '0.875rem', fontWeight: 500, marginTop: '0.2rem' }}>
                    <Building2 style={{ width: 14, height: 14 }} />
                    <span>{job.companyName}</span>
                  </div>
                </div>

                <span className="badge badge-candidate">
                  ${job.salary ? job.salary.toLocaleString() : 'N/A'}/yr
                </span>
              </div>

              {/* Location & Recruiter */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <MapPin style={{ width: 13, height: 13 }} /> {job.location}
                </span>
                {job.recruiterName && (
                  <span>Posted by: {job.recruiterName}</span>
                )}
              </div>

              {/* Description Snippet */}
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontSize: '0.875rem', 
                lineHeight: 1.5,
                display: '-webkit-box', 
                WebkitLineClamp: 2, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden' 
              }}>
                {job.description}
              </p>

              {/* Skill Tags */}
              {job.skills && (
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {job.skills.split(',').map((skill, idx) => (
                    <span key={idx} className="tag">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div style={{ marginTop: 'auto', paddingTop: '0.5rem', display: 'flex', gap: '0.6rem' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(job.id);
                  }}
                >
                  View Details
                </button>

                <button 
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  disabled={applyingJobId === job.id}
                  onClick={(e) => handleApply(e, job.id)}
                >
                  {applyingJobId === job.id ? (
                    'Applying...'
                  ) : (
                    <>
                      <Send style={{ width: 13, height: 13 }} /> Apply Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
