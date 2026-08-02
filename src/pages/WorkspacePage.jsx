import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ArrowLeft, Plus, Check, Circle, ExternalLink, Trash2,
  Code2, Dumbbell, Briefcase, MessageCircle, Smile, Droplets,
  Video, Mic, BookOpen, Link2, Timer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockDsaSessions } from '../data/mockDsaSessions';
import NewDsaSessionModal from '../components/NewDsaSessionModal';
import './WorkspacePage.css';

/* ═══════════════════════════════════════════
   Workspace configs per category
   ═══════════════════════════════════════════ */
const WORKSPACE_CONFIG = {
  dsa: {
    icon: Code2,
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.08)',
    title: 'DSA Practice',
    subtitle: 'Striver\'s A2Z DSA Sheet',
    sections: [
      {
        id: 'sheet',
        title: 'A2Z Sheet Progress',
        type: 'progress-cards',
        items: [
          { id: 'd1', text: 'Arrays — Easy', total: 14, completed: 14, lastQuestion: 'Two Sum', difficulty: 'Easy', diffColor: '#34d399', estTime: '3h 20m', topicTag: 'Array', gradient: 'linear-gradient(135deg, #134e4a 0%, #0f2a27 100%)', accentGlow: 'rgba(52,211,153,0.25)' },
          { id: 'd2', text: 'Arrays — Medium', total: 15, completed: 15, lastQuestion: 'Spiral Matrix', difficulty: 'Medium', diffColor: '#fbbf24', estTime: '5h 10m', topicTag: 'Array', gradient: 'linear-gradient(135deg, #451a03 0%, #292109 100%)', accentGlow: 'rgba(251,191,36,0.25)' },
          { id: 'd3', text: 'Arrays — Hard', total: 12, completed: 4, lastQuestion: 'Reverse Pairs', difficulty: 'Hard', diffColor: '#f87171', estTime: '6h 45m', topicTag: 'Array', gradient: 'linear-gradient(135deg, #450a0a 0%, #2a0f0f 100%)', accentGlow: 'rgba(248,113,113,0.25)' },
          { id: 'd4', text: 'Binary Search', total: 10, completed: 0, lastQuestion: 'Binary Search', difficulty: 'Medium', diffColor: '#fbbf24', estTime: '4h 00m', topicTag: 'Search', gradient: 'linear-gradient(135deg, #1e1b4b 0%, #111130 100%)', accentGlow: 'rgba(96,165,250,0.25)' },
          { id: 'd5', text: 'Strings', total: 15, completed: 0, lastQuestion: 'Reverse String', difficulty: 'Easy', diffColor: '#34d399', estTime: '4h 30m', topicTag: 'String', gradient: 'linear-gradient(135deg, #14532d 0%, #0c2317 100%)', accentGlow: 'rgba(52,211,153,0.2)' },
          { id: 'd6', text: 'Linked List', total: 20, completed: 0, lastQuestion: 'Reverse Linked List', difficulty: 'Medium', diffColor: '#fbbf24', estTime: '7h 20m', topicTag: 'LinkedList', gradient: 'linear-gradient(135deg, #3b0764 0%, #1e073a 100%)', accentGlow: 'rgba(167,139,250,0.25)' },
          { id: 'd7', text: 'Recursion & Backtracking', total: 12, completed: 0, lastQuestion: 'Subsets', difficulty: 'Hard', diffColor: '#f87171', estTime: '5h 50m', topicTag: 'Recursion', gradient: 'linear-gradient(135deg, #431407 0%, #231007 100%)', accentGlow: 'rgba(249,115,22,0.25)' },
        ],
      },
      {
        id: 'links',
        title: 'Resources',
        type: 'links',
        items: [
          { label: 'Striver A2Z Sheet', url: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2' },
          { label: 'LeetCode', url: 'https://leetcode.com' },
          { label: 'Neetcode Roadmap', url: 'https://neetcode.io/roadmap' },
        ],
      },
    ],
  },
  cardio: {
    icon: Dumbbell,
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.08)',
    title: 'Cardio & Workout',
    subtitle: 'Daily fitness routine',
    sections: [
      {
        id: 'routine',
        title: 'Today\'s Routine',
        type: 'checklist',
        items: [
          { id: 'c1', text: '5 min warm-up stretching', done: false },
          { id: 'c2', text: '20 min running / cycling', done: false },
          { id: 'c3', text: '3×15 push-ups', done: false },
          { id: 'c4', text: '3×20 squats', done: false },
          { id: 'c5', text: '3×30s plank hold', done: false },
          { id: 'c6', text: '3×15 lunges each leg', done: false },
          { id: 'c7', text: '5 min cool-down stretch', done: false },
        ],
      },
      {
        id: 'stats',
        title: 'Weekly Stats',
        type: 'stats',
        items: [
          { label: 'Sessions this week', value: '0/6' },
          { label: 'Avg duration', value: '—' },
          { label: 'Streak', value: '0 days' },
        ],
      },
    ],
  },
  internship: {
    icon: Briefcase,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.08)',
    title: 'Internship Tracker',
    subtitle: 'Applications & preparation',
    sections: [
      {
        id: 'tasks',
        title: 'Prep Checklist',
        type: 'checklist',
        items: [
          { id: 'i1', text: 'Update resume', done: false },
          { id: 'i2', text: 'Prepare portfolio projects', done: false },
          { id: 'i3', text: 'Practice system design basics', done: false },
          { id: 'i4', text: 'Mock interview practice', done: false },
          { id: 'i5', text: 'Apply to 5 companies this week', done: false },
          { id: 'i6', text: 'LinkedIn profile optimization', done: false },
        ],
      },
      {
        id: 'links',
        title: 'Resources',
        type: 'links',
        items: [
          { label: 'LinkedIn Jobs', url: 'https://linkedin.com/jobs' },
          { label: 'Wellfound (AngelList)', url: 'https://wellfound.com' },
          { label: 'Internshala', url: 'https://internshala.com' },
        ],
      },
    ],
  },
  communication: {
    icon: MessageCircle,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.08)',
    title: 'Communication',
    subtitle: 'Improve speaking & confidence',
    sections: [
      {
        id: 'weaknesses',
        title: 'Areas to Improve',
        type: 'checklist',
        items: [
          { id: 'cm1', text: 'Eye contact while speaking', done: false },
          { id: 'cm2', text: 'Reduce filler words (um, uh)', done: false },
          { id: 'cm3', text: 'Pace — speak slower', done: false },
          { id: 'cm4', text: 'Structure thoughts before talking', done: false },
          { id: 'cm5', text: 'Active listening practice', done: false },
        ],
      },
      {
        id: 'practice',
        title: 'Daily Practice',
        type: 'checklist',
        items: [
          { id: 'cp1', text: 'Record 2 min self-introduction', done: false },
          { id: 'cp2', text: 'Watch & analyze a TED talk', done: false },
          { id: 'cp3', text: 'Read aloud for 10 minutes', done: false },
          { id: 'cp4', text: 'Mirror practice — 5 min', done: false },
          { id: 'cp5', text: 'Video recording — explain a topic', done: false },
        ],
      },
      {
        id: 'links',
        title: 'Resources',
        type: 'links',
        items: [
          { label: 'Orai — Speech Coach App', url: 'https://orai.com' },
          { label: 'YouTube — Charisma on Command', url: 'https://youtube.com/@charismaoncommand' },
        ],
      },
    ],
  },
  'face-exercise': {
    icon: Smile,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.08)',
    title: 'Face Exercise',
    subtitle: 'Jawline & facial routine',
    sections: [
      {
        id: 'routine',
        title: 'Daily Routine',
        type: 'checklist',
        items: [
          { id: 'f1', text: 'Neck tilts — 3×15 each side', done: false },
          { id: 'f2', text: 'Jaw clenches — 3×20', done: false },
          { id: 'f3', text: 'Chin tucks — 3×15', done: false },
          { id: 'f4', text: 'Tongue press on roof — 30s hold ×3', done: false },
          { id: 'f5', text: 'Thumb pulling jaw resistance — 3×10', done: false },
          { id: 'f6', text: 'Mewing practice — 5 min', done: false },
          { id: 'f7', text: 'Cheek puff exercise — 3×15', done: false },
          { id: 'f8', text: 'Fish face hold — 20s ×3', done: false },
        ],
      },
    ],
  },
  water: {
    icon: Droplets,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.08)',
    title: 'Drink 3L Water',
    subtitle: 'Daily hydration tracker',
    sections: [
      {
        id: 'glasses',
        title: 'Water Intake (250ml each)',
        type: 'checklist',
        items: [
          { id: 'w1', text: 'Glass 1 — Morning', done: false },
          { id: 'w2', text: 'Glass 2 — Before breakfast', done: false },
          { id: 'w3', text: 'Glass 3 — Mid-morning', done: false },
          { id: 'w4', text: 'Glass 4 — Before lunch', done: false },
          { id: 'w5', text: 'Glass 5 — After lunch', done: false },
          { id: 'w6', text: 'Glass 6 — Afternoon', done: false },
          { id: 'w7', text: 'Glass 7 — Before dinner', done: false },
          { id: 'w8', text: 'Glass 8 — After dinner', done: false },
          { id: 'w9', text: 'Glass 9 — Late evening', done: false },
          { id: 'w10', text: 'Glass 10 — Before bed', done: false },
          { id: 'w11', text: 'Glass 11 — Extra', done: false },
          { id: 'w12', text: 'Glass 12 — Extra', done: false },
        ],
      },
    ],
  },
};

/* ═══════════════════════════════════════════
   Workspace Page
   ═══════════════════════════════════════════ */
export default function WorkspacePage() {
  const { state, dispatch } = useApp();
  const workspaceId = state.selectedWorkspace || 'dsa';
  const config = WORKSPACE_CONFIG[workspaceId];

  // Local state for checklists & progress (persists only in session for now)
  const [checkStates, setCheckStates] = useState(() => {
    const initial = {};
    if (config) {
      config.sections.forEach(s => {
        if (s.type === 'checklist') {
          s.items.forEach(item => { initial[item.id] = item.done; });
        } else if (s.type === 'progress-cards') {
          s.items.forEach(item => { initial[item.id] = item.completed; });
        }
      });
    }
    return initial;
  });

  if (!config) {
    return (
      <div className="ws-page">
        <div className="ws-header">
          <button className="ws-back" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}>
            <ArrowLeft size={20} />
          </button>
          <span>Not found</span>
        </div>
      </div>
    );
  }

  const Icon = config.icon;

  const toggleCheck = (id) => {
    setCheckStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Count progress
  let doneCount = 0;
  let totalCount = 0;
  config.sections.forEach(s => {
    if (s.type === 'checklist') {
      s.items.forEach(item => {
        totalCount++;
        if (checkStates[item.id]) doneCount++;
      });
    } else if (s.type === 'progress-cards') {
      s.items.forEach(item => {
        totalCount += item.total;
        doneCount += checkStates[item.id];
      });
    }
  });
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  
  const incrementProgress = (id, max) => {
    setCheckStates(prev => ({
      ...prev,
      [id]: Math.min(prev[id] + 1, max)
    }));
  };

  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  useEffect(() => {
    if (percent === 100 && !hasCelebrated) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: [config.color, '#ffffff', '#C7FF2A']
      });
      setHasCelebrated(true);
    } else if (percent < 100) {
      setHasCelebrated(false);
    }
  }, [percent, hasCelebrated, config.color]);

  return (
    <motion.div
      className="ws-page"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ── Header ── */}
      <div className="ws-header">
        <button className="ws-back" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}>
          <ArrowLeft size={20} />
        </button>
        <div className="ws-header-info">
          <h1 className="ws-title">{config.title}</h1>
          <span className="ws-subtitle">{config.subtitle}</span>
        </div>
        <div className="ws-header-actions">
          {workspaceId === 'dsa' && (
            <button className="dsa-new-session-btn" onClick={() => setIsNewSessionModalOpen(true)}>
              <Plus size={16} />
              <span>New Session</span>
            </button>
          )}
          <div className="ws-header-icon" style={{ '--ws-color': config.color, '--ws-bg': config.bg }}>
            <Icon size={20} />
          </div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      {totalCount > 0 && (
        <div className="ws-progress-section">
          <div className="ws-progress-info">
            <span className="ws-progress-label">{doneCount}/{totalCount} completed</span>
            <span className="ws-progress-pct">{percent}%</span>
          </div>
          <div className="ws-progress-track">
            <motion.div
              className="ws-progress-fill"
              style={{ '--ws-color': config.color }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* ── DSA Specific Sections ── */}
      {workspaceId === 'dsa' ? (
        <div className="dsa-workspace-layout">
          
          {/* Current Session */}
          <div className="dsa-layout-section">
            <h2 className="ws-section-title">Current Session</h2>
            {mockDsaSessions.filter(s => s.status === 'In Progress').map(session => (
              <motion.div 
                key={session.id} 
                className="dsa-current-card"
                whileHover={{ y: -2 }}
                onClick={() => {
                  dispatch({ type: 'SET_DSA_SESSION', payload: session.id });
                  dispatch({ type: 'SET_PAGE', payload: 'dsa-session' });
                }}
              >
                <div className="dsa-current-visual">
                  {session.image ? (
                    <img src={session.image} alt="Session code" className="dsa-current-img" />
                  ) : (
                    <div className="dsa-current-placeholder"><Code2 size={40} strokeWidth={1} /></div>
                  )}
                </div>
                <div className="dsa-current-content">
                  <div className="dsa-current-top">
                    <h3 className="dsa-current-title">{session.questionTitle}</h3>
                    <div className="dsa-current-badges">
                      <span className="dsa-badge diff">{session.difficulty}</span>
                      <span className="dsa-badge topic">{session.topic}</span>
                    </div>
                  </div>
                  
                  <div className="dsa-current-progress-track">
                     <div className="dsa-current-progress-fill" style={{ width: `${(session.checklist.filter(c=>c.done).length / session.checklist.length)*100}%`}} />
                  </div>
                  <div className="dsa-current-meta">
                    <span>{session.checklist.filter(c=>c.done).length} / {session.checklist.length} solved</span>
                    <span>•</span>
                    <span>{session.timeSpent} spent</span>
                    <span>•</span>
                    <span>Last worked {session.lastWorked}</span>
                  </div>
                  
                  {session.notesPreview && (
                    <p className="dsa-current-notes">"{session.notesPreview}"</p>
                  )}

                  <div className="dsa-current-actions">
                    <button className="dsa-continue-btn" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SET_DSA_SESSION', payload: session.id }); dispatch({ type: 'SET_PAGE', payload: 'dsa-session' }); }}>
                      Continue Solving <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent & Completed Grid */}
          <div className="dsa-layout-grid">
            <div className="dsa-layout-col">
              <h2 className="ws-section-title">Recent Sessions</h2>
              <div className="dsa-recent-list">
                {mockDsaSessions.filter(s => s.status === 'Paused' || (s.status === 'In Progress' && false)).map(session => (
                  <motion.div 
                    key={session.id} 
                    className="dsa-small-card"
                    whileHover={{ y: -2 }}
                    onClick={() => {
                      dispatch({ type: 'SET_DSA_SESSION', payload: session.id });
                      dispatch({ type: 'SET_PAGE', payload: 'dsa-session' });
                    }}
                  >
                    <div className="dsa-small-header">
                      <h4 className="dsa-small-title">{session.questionTitle}</h4>
                      <span className="dsa-small-status">{session.status}</span>
                    </div>
                    <div className="dsa-small-meta">
                      <span>{session.difficulty}</span>
                      <span>•</span>
                      <span>{session.topic}</span>
                      <span>•</span>
                      <span>{session.timeSpent}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="dsa-layout-col">
              <h2 className="ws-section-title">Completed Sessions</h2>
              <div className="dsa-recent-list">
                {mockDsaSessions.filter(s => s.status === 'Completed').map(session => (
                  <motion.div 
                    key={session.id} 
                    className="dsa-small-card completed"
                    whileHover={{ y: -2 }}
                    onClick={() => {
                      dispatch({ type: 'SET_DSA_SESSION', payload: session.id });
                      dispatch({ type: 'SET_PAGE', payload: 'dsa-session' });
                    }}
                  >
                    <div className="dsa-small-header">
                      <div className="dsa-small-title-wrap">
                        <Check size={14} className="dsa-completed-icon" />
                        <h4 className="dsa-small-title">{session.questionTitle}</h4>
                      </div>
                      <span className="dsa-small-date">{session.completionDate}</span>
                    </div>
                    <div className="dsa-small-meta">
                      <span>{session.timeSpent}</span>
                      <span>•</span>
                      <span>{session.difficulty}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Original Config Sections (Resources, Topic Progress at bottom) */}
          <div className="ws-sections dsa-secondary-sections">
            {config.sections.map(section => (
              <div key={section.id} className="ws-section">
                <h2 className="ws-section-title">{section.title}</h2>
                {/* Links */}
                {section.type === 'links' && (
                  <div className="ws-links">
                    {section.items.map((item, idx) => (
                      <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="ws-link-card">
                        <div className="ws-link-icon"><Link2 size={16} /></div>
                        <span className="ws-link-label">{item.label}</span>
                        <ExternalLink size={14} className="ws-link-ext" />
                      </a>
                    ))}
                  </div>
                )}
                
                {/* Topic Progress Cards (Moved to bottom) */}
                {section.type === 'progress-cards' && (
                  <div className="dsa-topic-compact-list">
                    {section.items.map(item => {
                       const pct = Math.round((checkStates[item.id] / item.total) * 100);
                       return (
                         <div key={item.id} className="dsa-topic-compact-card">
                           <div className="dsa-topic-info">
                             <span className="dsa-topic-name">{item.text}</span>
                             <span className="dsa-topic-meta">{checkStates[item.id]}/{item.total} solved</span>
                           </div>
                           <span className="dsa-topic-pct">{pct}%</span>
                         </div>
                       );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* ── Other Workspaces Sections ── */
        <div className="ws-sections">
          {config.sections.map(section => (
            <div key={section.id} className="ws-section">
              <h2 className="ws-section-title">{section.title}</h2>
  
              {/* Checklist */}
              {section.type === 'checklist' && (
                <div className="ws-checklist">
                  {section.items.map(item => {
                    const isDone = checkStates[item.id];
                    return (
                      <motion.button
                        key={item.id}
                        className={`ws-check-row ${isDone ? 'done' : ''}`}
                        onClick={() => toggleCheck(item.id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`ws-check-box ${isDone ? 'checked' : ''}`} style={{ '--ws-color': config.color }}>
                          <AnimatePresence>
                            {isDone && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Check size={12} strokeWidth={3} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <span className={`ws-check-text ${isDone ? 'done' : ''}`}>{item.text}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
  
              {/* Stats */}
              {section.type === 'stats' && (
                <div className="ws-stats">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="ws-stat-card">
                      <span className="ws-stat-val" style={{ color: config.color }}>{item.value}</span>
                      <span className="ws-stat-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
  
              {/* Links */}
              {section.type === 'links' && (
                <div className="ws-links">
                  {section.items.map((item, idx) => (
                    <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="ws-link-card">
                      <div className="ws-link-icon"><Link2 size={16} /></div>
                      <span className="ws-link-label">{item.label}</span>
                      <ExternalLink size={14} className="ws-link-ext" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isNewSessionModalOpen && (
          <NewDsaSessionModal 
            onClose={() => setIsNewSessionModalOpen(false)}
            onSave={(newSession) => {
              mockDsaSessions.unshift(newSession); // Hack to add to mock data for demo
              setIsNewSessionModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
