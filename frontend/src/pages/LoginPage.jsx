import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { LogIn } from 'lucide-react';

export const LoginPage = ({ setActivePage }) => {
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'CANDIDATE') {
        setActivePage('candidate-dashboard');
      } else if (user.role === 'RECRUITER') {
        setActivePage('recruiter-dashboard');
      } else {
        setActivePage('jobs');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials or login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '2rem auto', width: '100%' }}>
      <div className="panel panel-body" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px', height: '40px',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.85rem',
            color: 'var(--brand-navy)'
          }}>
            <LogIn style={{ width: 20, height: 20 }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>Account Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Enter your email and password to access TalentBridge
          </p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email"
              className="form-input"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <span 
            style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setActivePage('register-candidate')}
          >
            Candidate Registration
          </span>
          {' '}or{' '}
          <span 
            style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setActivePage('register-recruiter')}
          >
            Recruiter Registration
          </span>
        </div>
      </div>
    </div>
  );
};
