import React, { useState } from 'react';
import { Activity, Bot, Stethoscope, Building, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck, BrainCircuit, ChevronRight } from 'lucide-react';

const Brand = () => (
  <div className="onboard-brand absolute top-6 left-6" aria-hidden="true">
    <span><Activity size={16} /></span> Clinexa
  </div>
);

const Onboarding = ({ onComplete }) => {
  const steps = [
    {
      title: "Welcome to Clinexa",
      description: "A Unified AI-Powered Clinical Decision Support & Healthcare Management Platform.",
      icon: <Activity size={42} />,
      gradient: "text-gradient-default",
      tone: "blue",
      chips: ["AI-powered", "Clinical decision support", "Healthcare management"],
      buttonText: "Get Started"
    },
    {
      title: "AI-Powered Diagnostics",
      description: "Leverage state-of-the-art artificial intelligence to analyze symptoms and predict health outcomes with unprecedented accuracy.",
      icon: <BrainCircuit size={42} />,
      gradient: "text-gradient-ai",
      tone: "violet",
      chips: ["Symptom analysis", "Outcome prediction"],
      buttonText: "Next"
    },
    {
      title: "For Patients",
      description: "Check symptoms in your own language, get clear AI diagnosis, and book appointments instantly.",
      icon: <Bot size={42} />,
      gradient: "text-gradient-default",
      tone: "blue",
      chips: ["Your own language", "Clear AI diagnosis", "Instant booking"],
      buttonText: "Next"
    },
    {
      title: "For Doctors",
      description: "Review patient symptoms, AI explanations, and full medical history before the visit.",
      icon: <Stethoscope size={42} />,
      gradient: "text-gradient-doctor",
      tone: "green",
      chips: ["Symptom review", "AI explanations", "Medical history"],
      buttonText: "Next"
    },
    {
      title: "For Hospitals",
      description: "Manage beds, resources, and track disease trends in real-time.",
      icon: <Building size={42} />,
      gradient: "text-gradient-hospital",
      tone: "orange",
      chips: ["Beds & resources", "Disease trends", "Real-time"],
      buttonText: "Next"
    },
    {
      title: "Secure & Compliant",
      description: "Your medical data is fully encrypted. Privacy and security are embedded into our core.",
      icon: <ShieldCheck size={42} />,
      gradient: "text-gradient-secure",
      tone: "pink",
      chips: [],
      buttonText: "Next"
    }
  ];

  const roles = [
    { id: 'patient', title: 'I am a Patient', desc: 'Book appointments & check symptoms', icon: <Bot size={26} /> },
    { id: 'doctor', title: 'I am a Doctor', desc: 'Manage patients & AI diagnostics', icon: <Stethoscope size={26} /> },
    { id: 'hospital', title: 'I am a Hospital Admin', desc: 'Manage hospital resources', icon: <Building size={26} /> }
  ];

  const [step, setStep] = useState(() => {
    return localStorage.getItem('seenOnboarding') === 'true' ? steps.length : 0;
  });

  const handleSkip = () => {
    localStorage.setItem('seenOnboarding', 'true');
    setStep(steps.length);
  };

  const handleNext = () => {
    if (step === steps.length - 1) {
      localStorage.setItem('seenOnboarding', 'true');
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const currentStep = steps[step];

  if (step === steps.length) {
    return (
      <div className="onboarding-container animate-fade-in">
        <div
          className="premium-glass-card onboard-card p-10 flex-col items-center justify-center text-center relative"
          data-tone="green"
          style={{ maxWidth: '600px', width: '100%' }}
        >
          <Brand />

          <div className="onboard-icon floating-icon mb-6" style={{ marginTop: '1.5rem' }}>
            <CheckCircle size={42} className="animate-fade-in-up" />
          </div>
          <h1 className="heading-1 mb-2 animate-fade-in-up text-gradient-default stagger-1">Ready to Begin?</h1>
          <p className="text-muted-light mb-8 animate-fade-in-up stagger-2 text-lg">Select your portal to continue</p>

          <div className="flex flex-col w-full gap-4" style={{ padding: '0 0.5rem' }}>
            {roles.map((r, i) => (
              <button
                key={r.id}
                className={`role-card animate-fade-in-up stagger-${i + 3}`}
                data-role={r.id}
                onClick={() => onComplete(r.id)}
              >
                <span className="flex items-center gap-4">
                  <span className="role-icon">{r.icon}</span>
                  <span style={{ textAlign: 'left' }}>
                    <span className="role-title">{r.title}</span>
                    <span className="role-desc">{r.desc}</span>
                  </span>
                </span>
                <ChevronRight size={22} className="role-chev" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-container animate-fade-in">
      <div
        className="premium-glass-card onboard-card p-10 flex-col items-center justify-center text-center relative"
        data-tone={currentStep.tone}
        style={{ maxWidth: '650px', width: '100%', minHeight: '550px' }}
      >
        <Brand />

        <button onClick={handleSkip} className="onboard-skip absolute top-6 right-6 font-medium">
          Skip
        </button>

        {/* Step Indicator */}
        <div className="onboard-progress" role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={step + 1} aria-label="Onboarding progress">
          <div className="flex gap-2 items-center">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`seg ${idx === step ? 'is-active' : idx < step ? 'is-done' : ''}`}
              />
            ))}
          </div>
          <span className="onboard-count">{step + 1} of {steps.length}</span>
        </div>

        <div key={step} className="flex-col items-center animate-fade-in-up w-full">
          <div className="onboard-icon floating-icon mb-8">
            {currentStep.icon}
          </div>

          <h1 className={`heading-1 mb-4 ${currentStep.gradient}`}>{currentStep.title}</h1>
          <p className="onboard-desc" style={{ maxWidth: '430px', margin: '0 auto 1.5rem' }}>{currentStep.description}</p>

          {currentStep.chips.length > 0 && (
            <div className="onboard-chips">
              {currentStep.chips.map(c => <span key={c} className="feature-chip">{c}</span>)}
            </div>
          )}

          <div className="onboard-actions" style={{ marginTop: currentStep.chips.length > 0 ? '0.5rem' : '1.5rem' }}>
            {step > 0 && (
              <button className="btn-ghost flex items-center justify-center gap-2" onClick={handleBack} aria-label="Previous step">
                <ArrowLeft size={18} /> Back
              </button>
            )}
            <button
              className="btn-primary flex items-center justify-center gap-2 text-lg"
              style={{ flex: 1, padding: '1rem' }}
              onClick={handleNext}
            >
              {currentStep.buttonText} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;