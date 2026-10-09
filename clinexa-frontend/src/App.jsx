import React, { useState, useEffect } from 'react';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import HospitalDashboard from './components/HospitalDashboard';
import Onboarding from './components/Onboarding';
import AuthPage from './components/AuthPage';
import { Activity, User, Stethoscope, Building, LogOut } from 'lucide-react';

function App() {
  const [activeModule, setActiveModule] = useState('onboarding');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setIsAuthenticated(true);
        setActiveModule(user.role);
      } catch (e) {
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActiveModule('onboarding');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    if (activeModule === 'onboarding') {
      return <Onboarding onComplete={setActiveModule} />;
    }
    return (
      <div className={`dashboard-layout bg-${activeModule}`}>
        <AuthPage 
          role={activeModule} 
          onLogin={(user) => {
            setIsAuthenticated(true);
            setActiveModule(user.role);
          }} 
          onBack={() => setActiveModule('onboarding')} 
        />
      </div>
    );
  }

  return (
    <div className={`dashboard-layout bg-${activeModule}`}>
      {/* Navigation */}
      <nav className="nav-bar">
        <div className="flex items-center gap-2">
          <div className="p-2" style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', color: 'white' }}>
            <Activity size={24} />
          </div>
          <h1 className="heading-2" style={{ color: 'var(--primary-dark)', margin: 0, letterSpacing: '-1px' }}>Clinexa</h1>
        </div>
        
        <div className="flex gap-4" style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <button 
            className={activeModule === 'patient' ? 'btn-primary flex items-center gap-2' : 'flex items-center gap-2'}
            style={{ 
              padding: '0.5rem 1.5rem', 
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeModule === 'patient' ? '' : 'transparent',
              color: activeModule === 'patient' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setActiveModule('patient')}
          >
            <User size={18} /> Patient
          </button>
          
          <button 
            className={activeModule === 'doctor' ? 'btn-primary flex items-center gap-2' : 'flex items-center gap-2'}
             style={{ 
              padding: '0.5rem 1.5rem', 
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeModule === 'doctor' ? '' : 'transparent',
              color: activeModule === 'doctor' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setActiveModule('doctor')}
          >
            <Stethoscope size={18} /> Doctor
          </button>
          
          <button 
            className={activeModule === 'hospital' ? 'btn-primary flex items-center gap-2' : 'flex items-center gap-2'}
             style={{ 
              padding: '0.5rem 1.5rem', 
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeModule === 'hospital' ? '' : 'transparent',
              color: activeModule === 'hospital' ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              fontWeight: 500
            }}
            onClick={() => setActiveModule('hospital')}
          >
            <Building size={18} /> Hospital
          </button>
        </div>

        <button 
          className="btn-secondary flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {activeModule === 'patient' && <PatientDashboard />}
        {activeModule === 'doctor' && <DoctorDashboard />}
        {activeModule === 'hospital' && <HospitalDashboard />}
      </main>
    </div>
  );
}

export default App;
