import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { ArrowLeft, Building2, User, Clock, FileText } from 'lucide-react';

export const ApplicationDetailsPage = ({ applicationId, navigate }) => {
  const { isRecruiter } = useAuth();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchApplicationDetails = async () => {
      setLoading(true);
      setError('');
      try {
        let apps = [];
        if (isRecruiter) {
          apps = await api.getMyRecruiterJobApplications();
        } else {
          apps = await api.getMyCandidateApplications();
        }

        const match = apps?.find(a => String(a.id) === String(applicationId));
        if (!cancelled) {
          if (match) {
            setApplication(match);
          } else {
            setError(`Application #${applicationId} not found or unauthorized.`);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load application details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplicationDetails();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [applicationId, isRecruiter]);

  const handleStatusChange = async (newStatus) => {
    if (!application) return;
    setUpdatingStatus(true);
    setError('');
    setSuccess('');
    try {
      await api.updateApplicationStatus(application.id, newStatus);
      setApplication({ ...application, status: newStatus });
      setSuccess(`Application status updated to ${newStatus}`);
    } catch (err) {
      setError(err.message || 'Failed to update application status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return <span className="badge badge-accepted">Accepted</span>;
      case 'SHORTLISTED':
        return <span className="badge badge-shortlisted">Shortlisted</span>;
      case 'REJECTED':
        return <span className="badge badge-rejected">Rejected</span>;
      default:
        return <span className="badge badge-applied">Applied</span>;
    }
  };

  const handleBack = () => {
    if (isRecruiter) {
      navigate('/recruiter-dashboard');
    } else {
      navigate('/candidate-dashboard');
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p>Loading application details...</p>
      </div>
    );
  }

  if (error && !application) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Alert type="error" message={error} />
        <button className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }} onClick={handleBack}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Back Action */}
      <div>
        <button className="btn btn-secondary btn-sm" onClick={handleBack}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> {isRecruiter ? 'Back to Recruiter Dashboard' : 'Back to Candidate Dashboard'}
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {application && (
        <div className="panel" style={{ height: 'fit-content' }}>
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText style={{ width: 18, height: 18, color: 'var(--brand-navy)' }} />
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Application #{application.id}
              </h1>
            </div>

            <div>
              {getStatusBadge(application.status)}
            </div>
          </div>

          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="grid-cols-2" style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Job Position</span>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{application.jobTitle || 'Job Opening'}</p>
              </div>

              <div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Company</span>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 style={{ width: 14, height: 14 }} /> {application.companyName || 'Company'}
                </p>
              </div>
            </div>

            <div className="grid-cols-2">
              <div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Submission Date</span>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock style={{ width: 14, height: 14 }} />
                  {application.appliedAt ? new Date(application.appliedAt).toLocaleString() : 'Recent'}
                </p>
              </div>

              {application.candidateName && (
                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Candidate Applicant</span>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <User style={{ width: 14, height: 14 }} /> {application.candidateName}
                  </p>
                </div>
              )}
            </div>

            {/* Recruiter Status Update Controls */}
            {isRecruiter && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem' }}>Update Applicant Status</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <select 
                    className="form-select"
                    style={{ maxWidth: '240px' }}
                    value={application.status || 'APPLIED'}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>

                  {updatingStatus && <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Updating...</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
