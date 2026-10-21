import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Alert } from '../components/Alert';
import { User, FileText, Edit3, Save, ExternalLink } from 'lucide-react';

export const CandidateDashboard = ({ setActivePage, navigate }) => {

  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: '',
    location: '',
    education: '',
    experience: '',
    skills: ''
  });

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const [profileData, appsData] = await Promise.all([
          api.getMyCandidateProfile(),
          api.getMyCandidateApplications()
        ]);

        if (cancelled) return;
        setProfile(profileData);
        setApplications(appsData || []);

        if (profileData) {
          setEditForm({
            phone: profileData.phone || '',
            location: profileData.location || '',
            education: profileData.education || '',
            experience: profileData.experience || '',
            skills: profileData.skills || ''
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load candidate dashboard data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^[0-9]{10}$/.test(editForm.phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    try {
      const updated = await api.updateCandidateProfile(profile.id, editForm);
      setProfile({ ...profile, ...updated });
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
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

  const handleViewAppDetails = (appId) => {
    if (navigate) {
      navigate(`/applications/${appId}`);
    } else {
      setActivePage(`/applications/${appId}`);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
        <p>Loading candidate dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Candidate Dashboard</h1>
        <p className="page-subtitle">Manage your candidate profile and track job application statuses</p>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      <div className="grid-cols-2">
        {/* Profile Details Panel */}
        <div className="panel" style={{ height: 'fit-content' }}>
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User style={{ width: 18, height: 18, color: 'var(--brand-navy)' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>My Profile</h2>
            </div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 style={{ width: 13, height: 13 }} />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="panel-body">
            {!isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Candidate Name & Email</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{profile?.name} &bull; <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>{profile?.email}</span></p>
                </div>

                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Phone & Location</span>
                  <p style={{ color: 'var(--text-primary)' }}>{profile?.phone} &bull; {profile?.location}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Education</span>
                  <p style={{ color: 'var(--text-primary)' }}>{profile?.education}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Work Experience</span>
                  <p style={{ color: 'var(--text-primary)' }}>{profile?.experience}</p>
                </div>

                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Skills</span>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {profile?.skills?.split(',').map((skill, idx) => (
                      <span key={idx} className="tag">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number (10 digits)</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Location</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Education</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editForm.education}
                    onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Work Experience</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editForm.experience}
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Skills (comma separated)</label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editForm.skills}
                    onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '0.35rem' }}>
                  <Save style={{ width: 13, height: 13 }} /> Save Profile Updates
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Applications History Table/List */}
        <div className="panel" style={{ height: 'fit-content' }}>
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText style={{ width: 18, height: 18, color: 'var(--brand-navy)' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>My Applications ({applications.length})</h2>
            </div>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => navigate ? navigate('/jobs') : setActivePage('jobs')}
            >
              Browse Jobs
            </button>
          </div>

          <div className="panel-body" style={{ padding: applications.length > 0 ? 0 : '1.5rem' }}>
            {applications.length === 0 ? (
              <div className="empty-state" style={{ border: 'none', padding: '1.5rem 0' }}>
                <p>You haven't submitted any job applications yet.</p>
                <button 
                  className="btn btn-primary btn-sm" 
                  style={{ marginTop: '0.85rem' }}
                  onClick={() => navigate ? navigate('/jobs') : setActivePage('jobs')}
                >
                  Explore Jobs & Apply
                </button>
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job Position</th>
                      <th>Company</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 600 }}>{app.jobTitle || 'Job Opening'}</td>
                        <td style={{ color: 'var(--brand-blue)' }}>{app.companyName || 'Company'}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td>
                          {getStatusBadge(app.status)}
                        </td>
                        <td>
                          <button 
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.775rem' }}
                            onClick={() => handleViewAppDetails(app.id)}
                          >
                            <ExternalLink style={{ width: 12, height: 12 }} /> View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
