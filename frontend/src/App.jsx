import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { JobListingsPage } from './pages/JobListingsPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { ApplicationDetailsPage } from './pages/ApplicationDetailsPage';
import { CreateJobPage } from './pages/CreateJobPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterCandidatePage } from './pages/RegisterCandidatePage';
import { RegisterRecruiterPage } from './pages/RegisterRecruiterPage';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';

function parsePath(pathname) {
  if (!pathname || pathname === '/' || pathname === '/landing') {
    return { name: 'landing', params: {} };
  }
  if (pathname === '/jobs') {
    return { name: 'jobs', params: {} };
  }
  const jobMatch = pathname.match(/^\/jobs\/([^/]+)$/);
  if (jobMatch) {
    return { name: 'job-details', params: { jobId: jobMatch[1] } };
  }
  const appMatch = pathname.match(/^\/applications\/([^/]+)$/);
  if (appMatch) {
    return { name: 'application-details', params: { applicationId: appMatch[1] } };
  }
  if (pathname === '/recruiter/jobs/create') {
    return { name: 'create-job', params: {} };
  }
  if (pathname === '/login') {
    return { name: 'login', params: {} };
  }
  if (pathname === '/register-candidate') {
    return { name: 'register-candidate', params: {} };
  }
  if (pathname === '/register-recruiter') {
    return { name: 'register-recruiter', params: {} };
  }
  if (pathname === '/candidate-dashboard') {
    return { name: 'candidate-dashboard', params: {} };
  }
  if (pathname === '/recruiter-dashboard') {
    return { name: 'recruiter-dashboard', params: {} };
  }
  return { name: 'landing', params: {} };
}

export function App() {
  const [route, setRoute] = useState(() => parsePath(window.location.pathname));
  const [jobsRefreshKey, setJobsRefreshKey] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(parsePath(path));
    window.scrollTo(0, 0);
  };

  const handleSetActivePage = (pageOrPath) => {
    if (typeof pageOrPath === 'string') {
      if (pageOrPath.startsWith('/')) {
        navigate(pageOrPath);
      } else {
        switch (pageOrPath) {
          case 'jobs':
            navigate('/jobs');
            break;
          case 'login':
            navigate('/login');
            break;
          case 'register-candidate':
            navigate('/register-candidate');
            break;
          case 'register-recruiter':
            navigate('/register-recruiter');
            break;
          case 'candidate-dashboard':
            navigate('/candidate-dashboard');
            break;
          case 'recruiter-dashboard':
            navigate('/recruiter-dashboard');
            break;
          case 'landing':
          default:
            navigate('/landing');
            break;
        }
      }
    }
  };

  const handleJobCreated = () => {
    setJobsRefreshKey(prev => prev + 1);
  };

  const renderPage = () => {
    switch (route.name) {
      case 'jobs':
        return <JobListingsPage key={jobsRefreshKey} setActivePage={handleSetActivePage} navigate={navigate} />;
      case 'job-details':
        return <JobDetailsPage jobId={route.params.jobId} navigate={navigate} setActivePage={handleSetActivePage} />;
      case 'application-details':
        return <ApplicationDetailsPage applicationId={route.params.applicationId} navigate={navigate} setActivePage={handleSetActivePage} />;
      case 'create-job':
        return <CreateJobPage navigate={navigate} setActivePage={handleSetActivePage} onJobCreated={handleJobCreated} />;
      case 'login':
        return <LoginPage setActivePage={handleSetActivePage} navigate={navigate} />;
      case 'register-candidate':
        return <RegisterCandidatePage setActivePage={handleSetActivePage} navigate={navigate} />;
      case 'register-recruiter':
        return <RegisterRecruiterPage setActivePage={handleSetActivePage} navigate={navigate} />;
      case 'candidate-dashboard':
        return <CandidateDashboard setActivePage={handleSetActivePage} navigate={navigate} />;
      case 'recruiter-dashboard':
        return <RecruiterDashboard setActivePage={handleSetActivePage} navigate={navigate} />;
      case 'landing':
      default:
        return <LandingPage setActivePage={handleSetActivePage} navigate={navigate} />;
    }
  };

  // Map route name to activePage string for Navbar active state highlighting
  const getActivePageName = () => {
    if (route.name === 'job-details') return 'jobs';
    if (route.name === 'create-job') return 'recruiter-dashboard';
    if (route.name === 'application-details') return 'candidate-dashboard';
    return route.name;
  };

  return (
    <AuthProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar activePage={getActivePageName()} setActivePage={handleSetActivePage} navigate={navigate} />
        <main className="main-content">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
