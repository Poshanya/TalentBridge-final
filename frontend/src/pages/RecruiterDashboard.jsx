import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Alert } from '../components/Alert';
import { Building2, PlusCircle, Edit, Trash2, FileText, Save, X, ExternalLink } from 'lucide-react';

export const RecruiterDashboard = ({ navigate, setActivePage }) => {
  const [profile, setProfile] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editing existing job state
  const [editingJob, setEditingJob] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
    salary: '',
    skills: ''
  });

  const [profileForm, setProfileForm] = useState({
    companyName: '',
    location: '',
    designation: '',
    phone: ''
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [profileData, jobsData, appsData] = await Promise.all([
        api.getMyRecruiterProfile(),
        api.getMyJobs(),
        api.getMyRecruiterJobApplications()
      ]);

      setProfile(profileData);
      setMyJobs(jobsData || []);
      setApplications(appsData || []);

      if (profileData) {
        const compName = profileData.companyName || profileData.CompanyName || '';
        setProfileForm({
          companyName: compName,
          location: profileData.location || '',
          designation: profileData.designation || '',
          phone: profileData.phone || ''
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to load recruiter dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^[0-9]{10}$/.test(profileForm.phone)) {
      setError('Phone number must be 10 digits');
      return;
    }

    try {
      const payload = {
        companyName: profileForm.companyName,
        location: profileForm.location,
        designation: profileForm.designation,
        phone: profileForm.phone
      };
      const updated = await api.updateRecruiterProfile(profile.id, payload);
      setProfile({ ...profile, ...updated });
      setIsEditingProfile(false);
      setSuccess('Recruiter profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleEditJobSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: jobForm.title,
        companyName: jobForm.companyName,
        description: jobForm.description,
        location: jobForm.location,
        salary: parseFloat(jobForm.salary),
        skills: jobForm.skills
      };

      await api.updateJob(editingJob.id, payload);
      setEditingJob(null);
      setSuccess('Job listing updated successfully!');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    setError('');
    setSuccess('');
    try {
      await api.deleteJob(jobId);
      setSuccess('Job deleted successfully!');
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to delete job');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await api.updateApplicationStatus(appId, newStatus);
      setSuccess(`Application status updated to ${newStatus}`);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to update application status');
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      companyName: job.companyName || job.CompanyName || profile?.companyName || profile?.CompanyName || '',
      description: job.description || '',
      location: job.location || '',
      salary: job.salary || '',
      skills: job.skills || ''
    });
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

  const handleNavToCreateJob = () => {
    if (navigate) {
      navigate('/recruiter/jobs/create');
    } else {
      setActivePage('/recruiter/jobs/create');
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
        <p>Loading recruiter dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Recruiter Dashboard</h1>
          <p className="page-subtitle">Manage company jobs, review applicant submissions, and update candidate hiring status</p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={handleNavToCreateJob}
        >
          <PlusCircle style={{ width: 16, height: 16 }} /> Post New Job
        </button>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* Recruiter Profile Panel */}
      <div className="panel">
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 style={{ width: 18, height: 18, color: 'var(--brand-navy)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Company & Recruiter Profile</h2>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => setIsEditingProfile(!isEditingProfile)}>
            {isEditingProfile ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="panel-body">
          {!isEditingProfile ? (
            <div className="grid-cols-3" style={{ fontSize: '0.875rem' }}>
              <div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Company Name</span>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{profile?.companyName || profile?.CompanyName || 'N/A'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Designation & Recruiter</span>
                <p style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{profile?.designation} ({profile?.name})</p>
              </div>
              <div>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>Location & Phone</span>
                <p style={{ color: 'var(--text-primary)' }}>{profile?.location} &bull; {profile?.phone}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="grid-cols-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Company Name</label>
                  <input 
                    type="text" className="form-input"
                    value={profileForm.companyName}
                    onChange={(e) => setProfileForm({ ...profileForm, companyName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Location</label>
                  <input 
                    type="text" className="form-input"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid-cols-2">
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Designation / Role Title</label>
                  <input 
                    type="text" className="form-input"
                    value={profileForm.designation}
                    onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Phone Number (10 digits)</label>
                  <input 
                    type="text" className="form-input"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '0.25rem' }}>
                  <Save style={{ width: 13, height: 13 }} /> Save Recruiter Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Posted Jobs Panel */}
      <div className="panel">
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 style={{ width: 18, height: 18, color: 'var(--brand-navy)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Active Posted Jobs ({myJobs.length})</h2>
          </div>
        </div>

        <div className="panel-body">
          {myJobs.length === 0 ? (
            <div className="empty-state" style={{ border: 'none', padding: '1.5rem 0' }}>
              <p>You haven't posted any job listings yet.</p>
              <button 
                className="btn btn-primary btn-sm" 
                style={{ marginTop: '0.85rem' }}
                onClick={handleNavToCreateJob}
              >
                Post Your First Job Position
              </button>
            </div>
          ) : (
            <div className="grid-cols-2">
              {myJobs.map(job => (
                <div key={job.id} className="panel panel-body" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--bg-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{job.title}</h3>
                      <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {job.location} &bull; ${job.salary ? job.salary.toLocaleString() : 'N/A'}/yr
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate ? navigate(`/jobs/${job.id}`) : setActivePage(`/jobs/${job.id}`)} title="View Job Details Page">
                        <ExternalLink style={{ width: 13, height: 13 }} />
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(job)} title="Edit Job">
                        <Edit style={{ width: 13, height: 13 }} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteJob(job.id)} title="Delete Job">
                        <Trash2 style={{ width: 13, height: 13 }} />
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {job.skills?.split(',').map((s, idx) => (
                      <span key={idx} className="tag">{s.trim()}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Candidate Applications Table */}
      <div className="panel">
        <div className="panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText style={{ width: 18, height: 18, color: 'var(--brand-navy)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Candidate Applicants ({applications.length})</h2>
          </div>
        </div>

        <div className="panel-body" style={{ padding: applications.length > 0 ? 0 : '1.5rem' }}>
          {applications.length === 0 ? (
            <div className="empty-state" style={{ border: 'none', padding: '1.5rem 0' }}>
              <p>No candidates have applied to your active job postings yet.</p>
            </div>
          ) : (
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Job Position</th>
                    <th>Applied Date</th>
                    <th>Current Status</th>
                    <th>Update Hiring Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 600 }}>{app.candidateName || 'Candidate'}</td>
                      <td style={{ color: 'var(--brand-blue)' }}>{app.jobTitle}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        {getStatusBadge(app.status)}
                      </td>
                      <td>
                        <select 
                          className="form-select"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.825rem', width: 'auto', display: 'inline-block' }}
                          value={app.status || 'APPLIED'}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        >
                          <option value="APPLIED">APPLIED</option>
                          <option value="SHORTLISTED">SHORTLISTED</option>
                          <option value="ACCEPTED">ACCEPTED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.775rem' }}
                          onClick={() => handleViewAppDetails(app.id)}
                        >
                          <ExternalLink style={{ width: 12, height: 12 }} /> View
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

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="modal-overlay" onClick={() => setEditingJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Job Posting</h2>
              <button className="modal-close" onClick={() => setEditingJob(null)}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <form onSubmit={handleEditJobSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Job Title</label>
                  <input 
                    type="text" className="form-input" required placeholder="Senior Java Engineer"
                    value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Company Name</label>
                    <input 
                      type="text" className="form-input" required placeholder="TechCorp"
                      value={jobForm.companyName} onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Location</label>
                    <input 
                      type="text" className="form-input" required placeholder="Remote / New York, NY"
                      value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Annual Salary ($ USD)</label>
                    <input 
                      type="number" className="form-input" required placeholder="130000"
                      value={jobForm.salary} onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Required Skills (comma separated)</label>
                    <input 
                      type="text" className="form-input" required placeholder="Java, Spring Boot, MySQL"
                      value={jobForm.skills} onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Job Description</label>
                  <textarea 
                    className="form-textarea" required placeholder="Detail key responsibilities and qualifications required..."
                    value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingJob(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save style={{ width: 14, height: 14 }} /> Save Job Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
