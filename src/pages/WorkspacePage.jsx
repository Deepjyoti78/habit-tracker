import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Check, Circle, ExternalLink, Trash2,
  Code2, Dumbbell, Briefcase, MessageCircle, Smile, Droplets,
  Video, Mic, BookOpen, Link2, Timer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
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
        type: 'checklist',
        items: [
          { id: 'd1', text: 'Arrays — Easy', done: false },
          { id: 'd2', text: 'Arrays — Medium', done: false },
          { id: 'd3', text: 'Arrays — Hard', done: false },
          { id: 'd4', text: 'Binary Search', done: false },
          { id: 'd5', text: 'Strings — Basic', done: false },
          { id: 'd6', text: 'Linked List', done: false },
          { id: 'd7', text: 'Recursion & Backtracking', done: false },
          { id: 'd8', text: 'Stack & Queue', done: false },
          { id: 'd9', text: 'Greedy', done: false },
          { id: 'd10', text: 'Dynamic Programming — 1D', done: false },
          { id: 'd11', text: 'Dynamic Programming — 2D', done: false },
          { id: 'd12', text: 'Graphs — BFS/DFS', done: false },
          { id: 'd13', text: 'Trees', done: false },
          { id: 'd14', text: 'Tries', done: false },
          { id: 'd15', text: 'Bit Manipulation', done: false },
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

  // Local state for checklists (persists only in session for now)
  const [checkStates, setCheckStates] = useState(() => {
    const initial = {};
    if (config) {
      config.sections.forEach(s => {
        if (s.type === 'checklist') {
          s.items.forEach(item => { initial[item.id] = item.done; });
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
  const allCheckIds = [];
  config.sections.forEach(s => {
    if (s.type === 'checklist') s.items.forEach(item => allCheckIds.push(item.id));
  });
  const doneCount = allCheckIds.filter(id => checkStates[id]).length;
  const totalCount = allCheckIds.length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

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
        <div className="ws-header-icon" style={{ '--ws-color': config.color, '--ws-bg': config.bg }}>
          <Icon size={20} />
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

      {/* ── Sections ── */}
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
                        {isDone && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span className={`ws-check-text ${isDone ? 'done' : ''}`}>{item.text}</span>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Links */}
            {section.type === 'links' && (
              <div className="ws-links">
                {section.items.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ws-link-row"
                  >
                    <Link2 size={14} />
                    <span>{link.label}</span>
                    <ExternalLink size={12} className="ws-link-external" />
                  </a>
                ))}
              </div>
            )}

            {/* Stats */}
            {section.type === 'stats' && (
              <div className="ws-stats">
                {section.items.map((stat, i) => (
                  <div key={i} className="ws-stat-item">
                    <span className="ws-stat-value">{stat.value}</span>
                    <span className="ws-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
