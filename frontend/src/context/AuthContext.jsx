import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Ensure legacy localStorage keys are removed for Requirement 4
  try {
    localStorage.removeItem('talentbridge_user');
    localStorage.removeItem('talentbridge_token');
  } catch {
    // ignore
  }

  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('talentbridge_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('talentbridge_token') || null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      const userData = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role
      };
      const authToken = response.token;

      setUser(userData);
      setToken(authToken);

      sessionStorage.setItem('talentbridge_user', JSON.stringify(userData));
      sessionStorage.setItem('talentbridge_token', authToken);

      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('talentbridge_user');
    sessionStorage.removeItem('talentbridge_token');
  };

  const isCandidate = user?.role === 'CANDIDATE';
  const isRecruiter = user?.role === 'RECRUITER';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isCandidate,
      isRecruiter,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
