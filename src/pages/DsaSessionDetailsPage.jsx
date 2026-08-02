import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar, CheckCircle2, Circle, AlertCircle, ExternalLink, CalendarDays, Plus, Code2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockDsaSessions } from '../data/mockDsaSessions';
import './DsaSessionDetailsPage.css';

export default function DsaSessionDetailsPage() {
  const { state, dispatch } = useApp();
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (state.selectedDsaSessionId) {
      const found = mockDsaSessions.find(s => s.id === state.selectedDsaSessionId);
      setSession(found);
    }
  }, [state.selectedDsaSessionId]);

  if (!session) return <div className="dsa-detail-loading">Loading session...</div>;

  const handleBack = () => {
    dispatch({ type: 'SET_DSA_SESSION', payload: null });
    dispatch({ type: 'SET_PAGE', payload: 'workspace' });
  };

  return (
    <div className="dsa-detail-page">
      <div className="dsa-detail-container">
        {/* ── Top Nav ── */}
        <nav className="dsa-detail-nav">
          <button className="dsa-back-btn" onClick={handleBack}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </nav>

        {/* ── Header has been moved to Progress Card ── */}

        {/* ── Bento Grid ── */}
        <div className="dsa-bento-grid">
          
          {/* Bento: Screenshot */}
          {session.image && (
            <div className="bento-card bento-hero">
              <img src={session.image} alt="Session Preview" className="bento-hero-img" />
            </div>
          )}

          {/* Bento: Progress & Header Info */}
          <div className="bento-card bento-progress">
            <div className="bento-prog-header">
              <div className="dsa-det-badges">
                <span className="dsa-badge diff">{session.difficulty}</span>
                <span className="dsa-badge topic">{session.topic}</span>
                <span className={`dsa-badge status ${session.status.toLowerCase().replace(' ', '-')}`}>
                  {session.status}
                </span>
              </div>
              <h1 className="dsa-det-title">{session.questionTitle}</h1>
              <div className="dsa-det-actions">
                {session.leetcodeLink && (
                  <a href={session.leetcodeLink} target="_blank" rel="noopener noreferrer" className="dsa-action-btn">
                    <ExternalLink size={14} /> LeetCode
                  </a>
                )}
                {session.striverLink && (
                  <a href={session.striverLink} target="_blank" rel="noopener noreferrer" className="dsa-action-btn">
                    <ExternalLink size={14} /> Striver Sheet
                  </a>
                )}
                <button className="dsa-action-btn primary">
                  <Code2 size={14} /> Solution
                </button>
              </div>
            </div>
            
            <h3 className="bento-title" style={{ marginTop: '24px' }}>Progress</h3>
            
            <div className="bento-prog-track">
              <div className="bento-prog-fill" style={{ width: `${(session.checklist.filter(c=>c.done).length / session.checklist.length)*100}%`}} />
            </div>
            
            <div className="bento-prog-stats">
              <div className="bento-stat-mini">
                <CheckCircle2 size={14} /> {session.checklist.filter(c=>c.done).length}/{session.checklist.length} Solved
              </div>
              <div className="bento-stat-mini">
                <Clock size={14} /> {session.timeSpent}
              </div>
            </div>

            <div className="bento-checklist-compact">
              {session.checklist.map(item => (
                <div key={item.id} className={`bento-check-row ${item.done ? 'done' : ''}`}>
                  {item.done ? <CheckCircle2 size={14} className="icon-done" /> : <Circle size={14} className="icon-todo" />}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bento: Mistakes */}
          <div className="bento-card bento-mistakes">
            <h3 className="bento-title">
              <AlertCircle size={14} /> Mistakes
            </h3>
            {session.mistakes.length > 0 ? (
              <ul className="bento-mistakes-list">
                {session.mistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            ) : (
              <p className="bento-empty">No mistakes logged yet.</p>
            )}
            <button className="bento-add-btn"><Plus size={12} /> Log mistake</button>
          </div>

          {/* Bento: Revision */}
          <div className="bento-card bento-revision">
            <h3 className="bento-title">
              <CalendarDays size={14} /> Revision
            </h3>
            <div className="bento-rev-segmented">
              <button className="bento-rev-opt active">Tomorrow</button>
              <button className="bento-rev-opt">7 Days</button>
              <button className="bento-rev-opt">30 Days</button>
              <button className="bento-rev-opt">Custom</button>
            </div>
          </div>

          {/* Bento: Quick Stats */}
          <div className="bento-card bento-stats">
            <div className="bento-stat-col">
              <span className="bento-stat-lbl">Difficulty</span>
              <span className="bento-stat-val">{session.difficulty}</span>
            </div>
            <div className="bento-stat-col">
              <span className="bento-stat-lbl">Topic</span>
              <span className="bento-stat-val">{session.topic}</span>
            </div>
            <div className="bento-stat-col">
              <span className="bento-stat-lbl">Started</span>
              <span className="bento-stat-val">{session.startedAt}</span>
            </div>
            <div className="bento-stat-col">
              <span className="bento-stat-lbl">Attempts</span>
              <span className="bento-stat-val">{session.attempts}</span>
            </div>
            <div className="bento-stat-col">
              <span className="bento-stat-lbl">Revisions</span>
              <span className="bento-stat-val">{session.revisionCount || 0}</span>
            </div>
          </div>

        </div>

        {/* ── Notes ── */}
        <section className="dsa-fw-section">
          <h3 className="dsa-fw-title">Notes</h3>
          <textarea 
            className="dsa-notes-editor" 
            defaultValue={session.notes} 
            placeholder="Write your approach, thoughts, or copy code snippets here..."
          />
        </section>

        {/* ── Timeline ── */}
        <section className="dsa-fw-section">
          <h3 className="dsa-fw-title">Timeline</h3>
          <div className="dsa-fw-timeline">
            {session.timeline && session.timeline.map((event, idx) => (
              <div key={event.id} className="fw-timeline-row">
                <div className="fw-timeline-dot" />
                <div className="fw-timeline-content">
                  <span className="fw-timeline-date">{event.date}</span>
                  <span className="fw-timeline-text">{event.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Attachments ── */}
        <section className="dsa-fw-section">
          <h3 className="dsa-fw-title">Attachments</h3>
          <div className="dsa-fw-attachments">
            {session.attachments && session.attachments.length > 0 ? (
              session.attachments.map(att => (
                <div key={att.id} className="fw-attachment-card">
                  {att.type === 'image' ? (
                    <img src={att.url} alt={att.name} className="fw-att-thumb" />
                  ) : (
                    <div className="fw-att-link-icon"><ExternalLink size={16} /></div>
                  )}
                  <span className="fw-att-name">{att.name}</span>
                </div>
              ))
            ) : (
              <p className="bento-empty">No attachments yet.</p>
            )}
            <button className="fw-add-att-btn"><Plus size={14} /> Add Attachment</button>
          </div>
        </section>
      </div>
    </div>
  );
}
