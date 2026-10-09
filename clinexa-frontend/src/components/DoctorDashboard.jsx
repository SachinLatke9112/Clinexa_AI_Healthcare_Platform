import React from 'react';
import { doctorMock } from '../data/mockData';
import { Users, AlertTriangle, Clock, Stethoscope, Brain, FileText, CheckCircle, User, Droplet, Hash, Info } from 'lucide-react';

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();

export default function DoctorDashboard() {
  const { queue, currentCase } = doctorMock;
  const { patient, aiExplanation } = currentCase;

  return (
    <div className="doctor-layout flex gap-6 h-full">
      {/* Patient Queue Sidebar */}
      <div className="card doctor-queue flex-col h-full">
        <div className="queue-head">
          <h2 className="heading-3 flex items-center gap-2">
            <Users color="var(--primary)" /> Waiting Queue
          </h2>
          <p className="text-muted text-sm mt-1">{queue.length} patients in queue</p>
        </div>
        <div className="queue-list">
          {queue.map(p => {
            const isHigh = p.urgency === 'High';
            const isCurrent = p.name === patient.name;
            return (
              <div key={p.id} className={`queue-item ${isHigh ? 'is-high' : ''} ${isCurrent ? 'is-current' : ''}`}>
                <div className={`avatar ${isHigh ? 'is-danger' : ''}`} aria-hidden="true">{initials(p.name)}</div>
                <div className="queue-body">
                  <div className="queue-top">
                    <h4 className="font-semibold">{p.name}</h4>
                    <span className="queue-time"><Clock size={12} /> {p.time}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2">
                    <span className={`badge ${isHigh ? 'badge-danger' : 'badge-primary'}`}>
                      {p.urgency} Urgency
                    </span>
                    {isCurrent && <span className="badge badge-success">Current case</span>}
                  </div>
                  <div className="queue-flag">
                    <span className="font-semibold text-muted">AI Flag:</span> {p.predicted}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Case View */}
      <div className="doctor-main flex-col gap-6 flex-1 h-full">
        {/* Patient Header */}
        <div className="card case-header glass-panel">
          <div className="flex items-center gap-4">
            <div className="avatar avatar-lg" aria-hidden="true">{initials(patient.name)}</div>
            <div>
              <h1 className="heading-2">{patient.name}</h1>
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="info-chip"><User size={13} /> {patient.age} years, {patient.gender}</span>
                <span className="info-chip"><Droplet size={13} /> Blood: {patient.bloodGroup}</span>
                <span className="info-chip"><Hash size={13} /> ID: {patient.id}</span>
              </div>
            </div>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <CheckCircle size={18} /> Complete Consult
          </button>
        </div>

        {patient.allergies && patient.allergies.length > 0 && (
          <div className="allergy-banner" role="alert">
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span><strong>Allergy alert:</strong> {patient.allergies.join(', ')}</span>
          </div>
        )}

        <div className="doctor-cols flex gap-6">
          {/* AI Insights */}
          <div className="flex-col gap-6" style={{ flex: 2, minWidth: 0 }}>
            <div className="card p-6">
              <h3 className="heading-3 flex items-center gap-2 mb-4">
                <Brain color="var(--accent)" /> AI Insights & Diagnosis
              </h3>

              <div className="ai-callout mb-4">
                <div className="ai-callout-title">
                  <AlertTriangle size={18} /> High Confidence Match
                </div>
                <p>{aiExplanation}</p>
              </div>

              <h4 className="font-semibold mb-3">Suggested Conditions</h4>
              <div className="flex-col gap-3">
                {patient.suggestedDiagnosis.map((diag, idx) => {
                  const high = diag.confidence > 50;
                  return (
                    <div key={idx} className="diag-item">
                      <div className="diag-top">
                        <span className="font-semibold">{diag.condition}</span>
                        <span className="diag-pct">{diag.confidence}%</span>
                      </div>
                      <div className="diag-bar" role="img" aria-label={`${diag.confidence}% confidence`}>
                        <div className={`diag-bar-fill ${high ? 'is-high' : 'is-low'}`} style={{ width: `${diag.confidence}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="disclaimer mt-4">
                <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>AI output supports, and does not replace, your clinical judgement.</span>
              </div>
            </div>

            {/* Chat Transcript */}
            <div className="card p-6">
              <h3 className="heading-3 flex items-center gap-2 mb-4">
                <FileText color="var(--primary)" /> Pre-Consult Symptoms (AI Chat)
              </h3>
              <div className="transcript">
                {patient.chatHistory.map((msg, idx) => (
                  <div key={idx} className={`t-row ${msg.sender === 'ai' ? 'is-ai' : 'is-patient'}`}>
                    <span className="t-who">{msg.sender === 'ai' ? 'AI' : 'Patient'}</span>
                    <span className="t-text">{msg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="card p-6" style={{ flex: 1, minWidth: 0 }}>
            <h3 className="heading-3 flex items-center gap-2 mb-4">
              <Stethoscope color="var(--primary)" /> Medical History
            </h3>

            <div className="mb-6">
              <h4 className="section-label">Allergies</h4>
              <div className="flex flex-wrap gap-2">
                {patient.allergies.map(allergy => (
                  <span key={allergy} className="badge badge-danger">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="section-label">Past Visits</h4>
              <div className="timeline">
                {patient.history.map((record, idx) => (
                  <div key={idx} className="tl-item">
                    <span className="tl-dot" />
                    <div className="flex justify-between items-center gap-2 mb-1">
                      <span className="font-semibold">{record.condition}</span>
                      <span className="text-xs text-muted flex items-center gap-1"><Clock size={11} /> {record.date}</span>
                    </div>
                    <div className="text-sm text-muted">Treated by: {record.doctor}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}