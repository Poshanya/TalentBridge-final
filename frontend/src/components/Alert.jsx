import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export const Alert = ({ type = 'error', message, onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {isSuccess ? (
          <CheckCircle2 style={{ width: 16, height: 16, color: '#166534', flexShrink: 0 }} />
        ) : (
          <AlertCircle style={{ width: 16, height: 16, color: '#991b1b', flexShrink: 0 }} />
        )}
        <span>{message}</span>
      </div>

      {onClose && (
        <button 
          onClick={onClose} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'inherit', 
            cursor: 'pointer',
            padding: '0.15rem',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.8
          }}
          aria-label="Dismiss alert"
        >
          <X style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  );
};
