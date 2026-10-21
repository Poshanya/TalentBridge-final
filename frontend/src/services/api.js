// Central API Service for TalentBridge Backend Integration

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '');

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error('VITE_API_URL must be set to the deployed TalentBridge backend URL.');
}

const getAuthHeaders = () => {
  const token = sessionStorage.getItem('talentbridge_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }
  
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    let errorMessage = data.message || data.error;
    if (data.errors && typeof data.errors === 'object' && Object.keys(data.errors).length > 0) {
      const fieldDetails = Object.entries(data.errors)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join('; ');
      errorMessage = data.message ? `${data.message} (${fieldDetails})` : fieldDetails;
    }
    if (!errorMessage) {
      errorMessage = 'An unexpected error occurred';
    }
    throw new Error(errorMessage);
  }
  
  return data;
};

export const api = {
  // Authentication
  login: async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  // Candidate Registration & Profile
  registerCandidate: async (candidateData) => {
    const res = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData)
    });
    return handleResponse(res);
  },

  getMyCandidateProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/candidates/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateCandidateProfile: async (id, updateDto) => {
    const res = await fetch(`${API_BASE_URL}/candidates/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateDto)
    });
    return handleResponse(res);
  },

  // Recruiter Registration & Profile
  registerRecruiter: async (recruiterData) => {
    const res = await fetch(`${API_BASE_URL}/recruiters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recruiterData)
    });
    return handleResponse(res);
  },

  getMyRecruiterProfile: async () => {
    const res = await fetch(`${API_BASE_URL}/recruiters/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateRecruiterProfile: async (id, updateDto) => {
    const res = await fetch(`${API_BASE_URL}/recruiters/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateDto)
    });
    return handleResponse(res);
  },

  // Jobs Management
  getAllJobs: async () => {
    const res = await fetch(`${API_BASE_URL}/jobs`);
    return handleResponse(res);
  },

  getJobById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`);
    return handleResponse(res);
  },

  getMyJobs: async () => {
    const res = await fetch(`${API_BASE_URL}/jobs/my-jobs`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  createJob: async (jobDto) => {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobDto)
    });
    return handleResponse(res);
  },

  updateJob: async (id, jobDto) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobDto)
    });
    return handleResponse(res);
  },

  deleteJob: async (id) => {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Applications
  applyForJob: async (jobId) => {
    const res = await fetch(`${API_BASE_URL}/applications/job/${jobId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({})
    });
    return handleResponse(res);
  },

  getMyCandidateApplications: async () => {
    const res = await fetch(`${API_BASE_URL}/applications/my-applications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getMyRecruiterJobApplications: async () => {
    const res = await fetch(`${API_BASE_URL}/applications/recruiter-jobs`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getApplicationsForJob: async (jobId) => {
    const res = await fetch(`${API_BASE_URL}/applications/job/${jobId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateApplicationStatus: async (id, status) => {
    const res = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(status)
    });
    return handleResponse(res);
  }
};
