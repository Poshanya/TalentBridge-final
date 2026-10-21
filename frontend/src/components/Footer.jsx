import React from 'react';
import { Briefcase } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: '1.75rem 1.5rem',
      background: 'var(--bg-surface)',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--brand-navy)' }}>
          <Briefcase style={{ width: 18, height: 18, color: 'var(--brand-navy)' }} />
          <span>TalentBridge Platform</span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Full-Stack Job Recruitment Portal &bull; Spring Boot + React Integration
        </p>

        <p style={{ color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} TalentBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
