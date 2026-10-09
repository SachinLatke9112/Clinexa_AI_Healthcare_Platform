import React, { useState, useRef, useEffect } from 'react';
import { patientMock } from '../data/mockData';
import { Bot, MapPin, Clock, Calendar, CheckCircle, Send, Info, Hospital, Stethoscope } from 'lucide-react';

const QUICK_SYMPTOMS = ['Fever', 'Headache', 'Cough', 'Body ache', 'Sore throat'];

export default function PatientDashboard() {
  const [chat, setChat] = useState(patientMock.chatHistory);
  const [inputMessage, setInputMessage] = useState("");
  const [showBooking, setShowBooking] = useState(true); // Default true for demo

  // UI-only state (typing indicator, slot selection, demo confirmation)
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // { hospitalId, slot }
  const [booked, setBooked] = useState(null);             // { hospitalId, slot }
  const listRef = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [chat, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChat([...chat, { sender: "patient", text: inputMessage }]);
    setInputMessage("");
    setIsTyping(true);
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      setChat(prev => [...prev, { sender: "ai", text: "I'm analyzing your symptoms..." }]);
    }, 1000);
  };

  const addSymptom = (symptom) => {
    const s = symptom.toLowerCase();
    setInputMessage(m => (m.trim() ? `${m.trim()}, ${s}` : `I have ${s}`));
  };

  return (
    <div className="patient-layout flex gap-6 h-full">
      {/* AI Symptom Checker */}
      <div className="card patient-chat flex-col w-full h-full">
        <div className="chat-head">
          <h2 className="heading-3 flex items-center gap-2">
            <Bot color="var(--primary)" /> AI Symptom Assistant
          </h2>
          <p className="text-muted text-sm mt-1">Describe your symptoms in your own language.</p>
        </div>

        <div className="chat-scroll" ref={listRef} role="log" aria-live="polite">
          {chat.map((msg, idx) =>
            msg.sender === 'ai' ? (
              <div key={idx} className="msg-row">
                <div className="ai-avatar" aria-hidden="true"><Bot size={16} /></div>
                <div className="bubble bubble-ai">{msg.text}</div>
              </div>
            ) : (
              <div key={idx} className="msg-row is-user">
                <div className="bubble bubble-user">{msg.text}</div>
              </div>
            )
          )}

          {isTyping && (
            <div className="msg-row" aria-label="Assistant is typing">
              <div className="ai-avatar" aria-hidden="true"><Bot size={16} /></div>
              <div className="bubble bubble-ai typing"><span /><span /><span /></div>
            </div>
          )}
        </div>

        <div className="chat-composer">
          <div className="chat-chips" aria-label="Quick symptoms">
            {QUICK_SYMPTOMS.map(s => (
              <button key={s} type="button" className="chip" onClick={() => addSymptom(s)}>
                + {s}
              </button>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex gap-2 items-center">
            <input
              type="text"
              className="chat-input"
              aria-label="Describe your symptoms"
              placeholder="Type your symptoms..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button
              type="submit"
              className="btn-primary send-btn flex items-center justify-center"
              aria-label="Send message"
              disabled={!inputMessage.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* Suggested Diagnosis & Hospital Booking */}
      <div className="patient-side flex-col gap-6 h-full">

        {/* Diagnosis */}
        <div className="card p-6">
          <h3 className="heading-3 flex items-center gap-2 mb-4">
            <Stethoscope color="var(--accent)" /> AI Diagnosis
          </h3>
          <div className="flex-col gap-3">
            {patientMock.suggestedDiagnosis.map((diag, idx) => {
              const high = diag.confidence > 50;
              return (
                <div key={idx} className="diag-item">
                  <div className="diag-top">
                    <div>
                      <span className="font-semibold">{diag.condition}</span>
                      <span className={`badge ml-2 ${high ? 'badge-primary' : ''}`} style={high ? undefined : { background: '#eef2f7', color: '#475569' }}>
                        {high ? 'Most likely' : 'Possible'}
                      </span>
                    </div>
                    <span className="diag-pct">{diag.confidence}%</span>
                  </div>
                  <div className="diag-bar" role="img" aria-label={`${diag.confidence}% confidence`}>
                    <div
                      className={`diag-bar-fill ${high ? 'is-high' : 'is-low'}`}
                      style={{ width: `${diag.confidence}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="disclaimer mt-4">
            <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>AI suggestions are not a medical diagnosis. Please consult a doctor before taking any action.</span>
          </div>
        </div>

        {/* Hospitals */}
        {showBooking && (
          <div className="card p-6" style={{ flex: 1 }}>
            <h3 className="heading-3 flex items-center gap-2 mb-4">
              <Hospital color="var(--primary)" /> Recommended Hospitals
            </h3>
            <p className="text-sm text-muted mb-4">Based on 'General Medicine' department availability near you.</p>

            <div className="flex-col gap-4">
              {patientMock.hospitals.map(hospital => {
                const isActive = selectedSlot?.hospitalId === hospital.id;
                const isBooked = booked?.hospitalId === hospital.id;
                return (
                  <div key={hospital.id} className={`hospital-card ${isActive ? 'is-active' : ''}`}>
                    <div className="hospital-head">
                      <div className="h-icon" aria-hidden="true"><Hospital size={18} /></div>
                      <h4 className="font-semibold">{hospital.name}</h4>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className="meta-chip"><MapPin size={13} /> {hospital.distance}</span>
                      <span className="meta-chip"><Clock size={13} /> Wait: {hospital.waitTime}</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {hospital.slots.map(slot => {
                        const selected = isActive && selectedSlot.slot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            className={`slot-btn ${selected ? 'is-selected' : ''}`}
                            aria-pressed={selected}
                            onClick={() => { setSelectedSlot({ hospitalId: hospital.id, slot }); setBooked(null); }}
                          >
                            <Calendar size={12} /> {slot}
                          </button>
                        );
                      })}
                    </div>

                    {isActive && !isBooked && (
                      <div className="confirm-bar animate-fade-in">
                        <span className="text-muted">Selected: <strong style={{ color: 'var(--text-main)' }}>{selectedSlot.slot}</strong></span>
                        <button type="button" className="btn-primary btn-sm" onClick={() => setBooked(selectedSlot)}>
                          Confirm booking
                        </button>
                      </div>
                    )}
                    {isBooked && (
                      <div className="booked-note animate-fade-in">
                        <CheckCircle size={16} /> Appointment requested for {booked.slot}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}