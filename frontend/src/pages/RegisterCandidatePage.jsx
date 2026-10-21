import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';

export const RegisterCandidatePage = ({ setActivePage }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    education: '',
    experience: '',
    skills: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits (0-9)');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user: {
          name: formData.name,
          email: formData.email,
          password: formData.password
        },
        candidateProfile: {
          phone: formData.phone,
          location: formData.location,
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills
        }
      };

      await api.registerCandidate(payload);

      // Auto login after registration
      await login(formData.email, formData.password);
      setActivePage('candidate-dashboard');
    } catch (err) {
      setError(err.message || 'Candidate registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '620px', margin: '2rem auto', width: '100%' }}>
      <div className="panel panel-body" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="badge badge-candidate" style={{ marginBottom: '0.5rem' }}>
            Candidate Registration
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Create Candidate Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Build your professional profile to apply for software engineering roles
          </p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="grid-cols-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Full Name</label>
              <input 
                type="text"
                name="name"
                className="form-input"
                required
                placeholder="Jane Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Email Address</label>
              <input 
                type="email"
                name="email"
                className="form-input"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Password (min 8 characters)</label>
              <input 
                type="password"
                name="password"
                className="form-input"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Phone Number (10 digits)</label>
              <input 
                type="text"
                name="phone"
                className="form-input"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid-cols-2">
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Location</label>
              <input 
                type="text"
                name="location"
                className="form-input"
                required
                placeholder="San Francisco, CA"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Highest Education</label>
              <input 
                type="text"
                name="education"
                className="form-input"
                required
                placeholder="B.S. in Computer Science"
                value={formData.education}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Work Experience Summary</label>
            <input 
              type="text"
              name="experience"
              className="form-input"
              required
              placeholder="3 years full stack software development experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Technical Skills (comma separated)</label>
            <input 
              type="text"
              name="skills"
              className="form-input"
              required
              placeholder="Java, Spring Boot, React, SQL, REST APIs"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: '0.75rem' }}
          >
            {loading ? 'Creating Candidate Profile...' : 'Complete Candidate Registration'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <span 
            style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setActivePage('login')}
          >
            Sign in to your account
          </span>
        </div>
      </div>
    </div>
  );
};
