import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { PlusCircle, ArrowLeft, Save } from 'lucide-react';

export const CreateJobPage = ({ navigate, onJobCreated }) => {
  const { isRecruiter } = useAuth();

  const [form, setForm] = useState({
    title: '',
    companyName: '',
    description: '',
    location: '',
    salary: '',
    skills: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Pre-populate company name and location from recruiter profile if available
    api.getMyRecruiterProfile().then(profile => {
      if (profile) {
        setForm(prev => ({
          ...prev,
          companyName: profile.companyName || profile.CompanyName || prev.companyName,
          location: profile.location || prev.location
        }));
      }
    }).catch(() => {
      // ignore
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isRecruiter) {
      setError('Only authenticated recruiters can post job openings');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: form.title,
        companyName: form.companyName,
        description: form.description,
        location: form.location,
        salary: parseFloat(form.salary),
        skills: form.skills
      };

      await api.createJob(payload);
      setSuccess('Job position posted successfully!');
      
      if (onJobCreated) {
        onJobCreated();
      }

      // Short timeout to display success before navigating back
      setTimeout(() => {
        navigate('/recruiter-dashboard');
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to create job posting');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/recruiter-dashboard')}>
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Recruiter Dashboard
        </button>
      </div>

      <div className="panel panel-body" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px', height: '40px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.75rem',
            color: 'var(--brand-navy)'
          }}>
            <PlusCircle style={{ width: 20, height: 20 }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Post New Job Opening</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Fill out position requirements to publish a job listing for engineering talent
          </p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Job Title</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              placeholder="e.g. Senior Full-Stack Engineer"
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid-cols-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Company Name</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="TechCorp Innovations"
                value={form.companyName} 
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Location</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="San Francisco, CA (or Remote)"
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Annual Salary ($ USD)</label>
              <input 
                type="number" 
                className="form-input" 
                required 
                placeholder="135000"
                value={form.salary} 
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Required Skills (comma separated)</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="Java, Spring Boot, React, MySQL"
                value={form.skills} 
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Job Description & Responsibilities</label>
            <textarea 
              className="form-textarea" 
              required 
              placeholder="Detail key responsibilities, qualifications, tech stack, and team culture..."
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => navigate('/recruiter-dashboard')}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              <Save style={{ width: 15, height: 15 }} /> {loading ? 'Publishing...' : 'Publish Job Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
