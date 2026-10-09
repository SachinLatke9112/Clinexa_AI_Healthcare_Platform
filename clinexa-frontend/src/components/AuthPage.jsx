import React, { useState } from 'react';
import { Mail, Lock, User, Building, Stethoscope, ArrowLeft, Loader2, Eye, EyeOff, Activity } from 'lucide-react';

export default function AuthPage({ role, onLogin, onBack }) {
  const [isLogin, setIsLogin] = useState(true);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const getRoleInfo = () => {
    switch (role) {
      case 'patient': return { title: 'Patient Portal', icon: <User size={48} color="#60a5fa" />, color: '#60a5fa', gradient: 'text-gradient-patient' };
      case 'doctor': return { title: 'Doctor Access', icon: <Stethoscope size={48} color="#34d399" />, color: '#34d399', gradient: 'text-gradient-doctor' };
      case 'hospital': return { title: 'Hospital Admin', icon: <Building size={48} color="#fb923c" />, color: '#fb923c', gradient: 'text-gradient-hospital' };
      default: return { title: 'Portal', icon: <User size={48} color="#60a5fa" />, color: '#60a5fa', gradient: 'text-gradient-default' };
    }
  };

  const info = getRoleInfo();

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
    if (score === 3) return { score: 3, label: 'Good', color: '#34d399' };
    return { score: 4, label: 'Strong', color: '#10b981' };
  };

  const pwStrength = getPasswordStrength();

  const validateForm = () => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Invalid email format";

    if (!password) errors.password = "Password is required";
    else if (!isLogin && password.length < 8) errors.password = "Password must be at least 8 characters";

    if (!isLogin) {
      if (!fullName) errors.fullName = "Full Name is required";
      if (role === 'doctor' && !licenseNumber) errors.licenseNumber = "License Number is required";
      if (role === 'hospital' && !hospitalId) errors.hospitalId = "Hospital ID is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setMessage('');

    try {
      const endpoint = isLogin ? 'http://localhost:8000/api/login' : 'http://localhost:8000/api/register';
      const payload = { email, password, role };

      if (!isLogin) {
        payload.full_name = fullName;
        if (role === 'doctor') payload.license_number = licenseNumber;
        if (role === 'hospital') payload.hospital_id = hospitalId;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.detail)) {
          const beErrors = {};
          data.detail.forEach(err => {
            const field = err.loc[err.loc.length - 1];
            if (field === 'full_name') beErrors.fullName = err.msg;
            else if (field === 'license_number') beErrors.licenseNumber = err.msg;
            else if (field === 'hospital_id') beErrors.hospitalId = err.msg;
            else beErrors[field] = err.msg;
          });
          setFieldErrors(beErrors);
          throw new Error('Please fix the highlighted errors below');
        } else {
          throw new Error(data.detail || 'Authentication failed');
        }
      }

      // Store JWT token and session data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (!isLogin) {
        setMessage('Account created successfully! Logging you in...');
      }

      onLogin(data.user);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page flex flex-col items-center w-full p-4 py-20 animate-fade-in relative overflow-y-auto" style={{ minHeight: '100vh' }}>
      <button
        onClick={onBack}
        className="back-pill flex items-center gap-2 absolute top-6 left-6 animate-fade-in transition-transform hover:-translate-x-1 font-medium"
      >
        <ArrowLeft size={18} /> Back to Selection
      </button>

      <div className="brand-mark absolute top-6 right-6 animate-fade-in" aria-hidden="true">
        <span><Activity size={16} /></span> Clinexa
      </div>

      <div
        className="premium-glass-card auth-card p-10 flex-col items-center animate-fade-in-up my-auto"
        data-role={role}
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <div className="auth-icon mb-6">
          {info.icon}
        </div>

        <h2 className={`heading-2 mb-3 text-center ${info.gradient}`} style={{ fontSize: '2.1rem', fontWeight: 800 }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <span className="role-chip mb-8">{info.title}</span>

        {error && (
          <div role="alert" className="w-full p-3 mb-4 text-sm font-medium rounded-md bg-red-50 text-red-600 border border-red-200" style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '12px' }}>
            {error}
          </div>
        )}

        {message && (
          <div role="status" className="w-full p-3 mb-4 text-sm font-medium rounded-md" style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0', borderRadius: '12px' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex-col gap-5" autoComplete="off">
          {!isLogin && (
            <div className="animate-fade-in-up stagger-1">
              <label htmlFor="auth-fullname" className="text-sm font-semibold block text-light">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="relative flex items-center">
                <User size={18} className="field-icon-left" />
                <input
                  id="auth-fullname"
                  type="text"
                  required
                  autoComplete="off"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setFieldErrors(p => ({ ...p, fullName: null })); }}
                  className="input-glass pl-10"
                  style={{ borderColor: fieldErrors.fullName ? '#ef4444' : undefined }}
                  aria-invalid={!!fieldErrors.fullName}
                  placeholder="John Doe"
                />
              </div>
              {fieldErrors.fullName && <p className="field-error">{fieldErrors.fullName}</p>}
            </div>
          )}

          <div className="animate-fade-in-up stagger-2">
            <label htmlFor="auth-email" className="text-sm font-semibold block text-light">Email Address <span style={{ color: '#ef4444' }}>*</span></label>
            <div className="relative flex items-center">
              <Mail size={18} className="field-icon-left" />
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: null })); }}
                className="input-glass pl-10"
                style={{ borderColor: fieldErrors.email ? '#ef4444' : undefined }}
                aria-invalid={!!fieldErrors.email}
                placeholder="you@example.com"
              />
            </div>
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div className="animate-fade-in-up stagger-3">
            <label htmlFor="auth-password" className="text-sm font-semibold block text-light">Password <span style={{ color: '#ef4444' }}>*</span></label>
            <div className="relative flex items-center">
              <Lock size={18} className="field-icon-left" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: null })); }}
                className="input-glass pl-10"
                style={{ borderColor: fieldErrors.password ? '#ef4444' : undefined }}
                aria-invalid={!!fieldErrors.password}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="field-icon-right"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && password.length > 0 && (
              <div className="mt-2 animate-fade-in">
                <div className="flex gap-1 mb-1" style={{ height: '4px' }}>
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        background: level <= pwStrength.score ? pwStrength.color : '#e2e8f0',
                        borderRadius: '2px',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
                <div className="text-right mt-1">
                  <span style={{ color: pwStrength.color, fontSize: '0.75rem', fontWeight: 700 }}>{pwStrength.label}</span>
                </div>
              </div>
            )}
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          {!isLogin && role === 'doctor' && (
            <div className="animate-fade-in-up stagger-4">
              <label htmlFor="auth-license" className="text-sm font-semibold block text-light">Medical License Number <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="relative flex items-center">
                <Stethoscope size={18} className="field-icon-left" />
                <input
                  id="auth-license"
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => { setLicenseNumber(e.target.value); setFieldErrors(p => ({ ...p, licenseNumber: null })); }}
                  className="input-glass pl-10"
                  style={{ borderColor: fieldErrors.licenseNumber ? '#ef4444' : undefined }}
                  aria-invalid={!!fieldErrors.licenseNumber}
                  placeholder="MD-12345"
                />
              </div>
              {fieldErrors.licenseNumber && <p className="field-error">{fieldErrors.licenseNumber}</p>}
            </div>
          )}

          {!isLogin && role === 'hospital' && (
            <div className="animate-fade-in-up stagger-4">
              <label htmlFor="auth-hospital" className="text-sm font-semibold block text-light">Hospital Registration ID <span style={{ color: '#ef4444' }}>*</span></label>
              <div className="relative flex items-center">
                <Building size={18} className="field-icon-left" />
                <input
                  id="auth-hospital"
                  type="text"
                  required
                  value={hospitalId}
                  onChange={(e) => { setHospitalId(e.target.value); setFieldErrors(p => ({ ...p, hospitalId: null })); }}
                  className="input-glass pl-10"
                  style={{ borderColor: fieldErrors.hospitalId ? '#ef4444' : undefined }}
                  aria-invalid={!!fieldErrors.hospitalId}
                  placeholder="HOSP-9876"
                />
              </div>
              {fieldErrors.hospitalId && <p className="field-error">{fieldErrors.hospitalId}</p>}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex justify-center items-center gap-2 animate-fade-in-up stagger-5">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer text-center text-sm animate-fade-in-up stagger-5 text-light">
          <span className="text-muted-light">{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button
            type="button"
            className="auth-switch ml-2 hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setMessage('');
              setFieldErrors({});
            }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}