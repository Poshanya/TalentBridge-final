import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { Building2, MapPin, Send, ArrowLeft } from 'lucide-react';

export const JobDetailsPage = ({ jobId, navigate }) => {
  const { isAuthenticated, isCandidate, isRecruiter } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchJobDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getJobById(jobId);
        if (!cancelled) setJob(data);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load job details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isCandidate) {
      setError('Only Candidate accounts can apply for jobs');
      return;
    }

    setApplying(true);
    setError('');
    setSuccess('');

    try {
      await api.applyForJob(jobId);
      setSuccess('Application submitted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Alert type="error" message={error} />
        <button className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }} onClick={() => navigate('/jobs')}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Back Action */}
      <div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/jobs')}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Jobs
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {job && (
        <div className="panel panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
            <div>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                {job.title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-blue)', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.35rem' }}>
                <Building2 style={{ width: 16, height: 16 }} />
                <span>{job.companyName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span className="badge badge-candidate" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                ${job.salary ? job.salary.toLocaleString() : 'N/A'} / year
              </span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin style={{ width: 13, height: 13 }} /> {job.location}
              </span>
            </div>
          </div>

          {/* Recruiter info if available */}
          {job.recruiterName && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)' }}>
              Posted by Hiring Manager: <strong>{job.recruiterName}</strong>
            </div>
          )}

          {/* Description Section */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Job Description
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {job.description}
            </p>
          </div>

          {/* Skills Section */}
          {job.skills && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Required Skills & Qualifications
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {job.skills.split(',').map((skill, idx) => (
                  <span key={idx} className="tag" style={{ fontSize: '0.825rem', padding: '0.25rem 0.65rem' }}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/jobs')}>
              <ArrowLeft style={{ width: 14, height: 14 }} /> Back to All Jobs
            </button>

            {isRecruiter ? (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                You are logged in as Recruiter
              </span>
            ) : (
              <button 
                className="btn btn-primary"
                disabled={applying}
                onClick={handleApply}
              >
                {applying ? 'Submitting Application...' : (
                  <>
                    <Send style={{ width: 15, height: 15 }} /> Apply for Position
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
