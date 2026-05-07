import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Check, Plus, Minus, Droplets,
  Edit3, Bell, ChevronDown, Clock, RefreshCw,
  Settings, Play, Square, Heart, MoreHorizontal,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CalendarStrip from '../components/CalendarStrip';
import './HabitTrackerPage.css';

// ── Water Tracker ──────────────────────────────────────────
function WaterTracker({ habit }) {
  const total = habit.targetValue || 10;
  const [filled, setFilled] = useState(habit.currentValue || 4);
  const [remind, setRemind] = useState(true);

  const glasses = Array.from({ length: total });

  return (
    <div className="ht-content">
      <div className="ht-hero-section">
        <div className="ht-hero-text">
          <h2 className="ht-hero-title">{filled} of {total} glasses</h2>
          <p className="ht-hero-desc">
            Nova, you drank {filled}/{total} glasses of water. Keep going only {total - filled} glasses left for today.
          </p>
        </div>
        <button className="ht-edit-btn"><Edit3 size={18} /></button>
      </div>

      <div className="ht-water-grid-v2">
        {glasses.map((_, i) => (
          <motion.div
            key={i}
            className={`ht-glass-v2 ${i < filled ? 'filled' : ''}`}
            onClick={() => setFilled(i + 1)}
            whileTap={{ scale: 0.9 }}
            style={{ '--glass-color': habit.color }}
          >
            <Droplets size={22} />
          </motion.div>
        ))}
        <button className="ht-glass-add-btn" onClick={() => setFilled(f => Math.min(total, f + 1))}>
          <Plus size={20} />
        </button>
      </div>

      <div className="ht-notification-card">
        <div className="ht-notif-row">
          <div className="ht-notif-left">
            <span className="ht-notif-label">Notification</span>
            <p className="ht-notif-sub">Remind me to drink water</p>
          </div>
          <div
            className={`ht-toggle ${remind ? 'on' : ''}`}
            onClick={() => setRemind(!remind)}
          >
            <div className="ht-toggle-knob" />
          </div>
        </div>
        <div className="ht-dropdown-pill">
          <span>Every 45 minutes</span>
          <ChevronDown size={16} />
        </div>
      </div>

      <div className="ht-chart-card">
        <div className="ht-chart-header">
          <h3 className="ht-chart-title">Summary:</h3>
          <div className="ht-chart-period">Today <ChevronDown size={14} /></div>
        </div>
        <div className="ht-bar-chart">
          {[40, 20, 30, 80, 50, 60].map((h, i) => (
            <div key={i} className="ht-bar-wrap">
              <motion.div
                className="ht-bar-fill"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                style={{ backgroundColor: i === 3 ? habit.color : 'rgba(255,255,255,0.1)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sleep Tracker ──────────────────────────────────────────
function SleepTracker({ habit }) {
  const [quality] = useState(86);
  const circumference = 2 * Math.PI * 65;
  const offset = circumference - (circumference * quality) / 100;

  return (
    <div className="ht-content">
      <div className="ht-sleep-hero">
        <div className="ht-sleep-ring-container">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="65" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <motion.circle
              cx="90" cy="90" r="65" fill="none"
              stroke={habit.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              transform="rotate(-90 90 90)"
            />
          </svg>
          <div className="ht-sleep-ring-info">
            <span className="ht-ring-label">Sleep quality</span>
            <span className="ht-ring-val">{quality}%</span>
            <span className="ht-ring-status">You sleep better today <Check size={10} /></span>
          </div>
        </div>
        <button className="ht-sleep-edit-btn"><Edit3 size={18} /></button>
      </div>

      <div className="ht-sleep-stats-row">
        <div className="ht-sleep-stat-item">
          <span className="ht-stat-label">FALL ASLEEP</span>
          <span className="ht-stat-val">11:22 PM</span>
        </div>
        <div className="ht-sleep-stat-item">
          <span className="ht-stat-label">WAKE UP</span>
          <span className="ht-stat-val">06:52 AM</span>
        </div>
        <div className="ht-sleep-stat-item">
          <span className="ht-stat-label">DURATION</span>
          <span className="ht-stat-val">7:30 H</span>
        </div>
      </div>

      <div className="ht-chart-card">
        <div className="ht-chart-header">
          <h3 className="ht-chart-title">Summary:</h3>
          <div className="ht-chart-period">Today <ChevronDown size={14} /></div>
        </div>
        <div className="ht-bar-chart-complex">
          {[60, 40, 70, 90, 50, 80, 45, 65].map((h, i) => (
            <div key={i} className="ht-bar-stack">
              <div className="ht-bar-top" style={{ height: `${h * 0.4}%`, backgroundColor: i % 3 === 0 ? habit.color : 'rgba(255,255,255,0.1)' }} />
              <div className="ht-bar-mid" style={{ height: `${h * 0.3}%`, backgroundColor: 'rgba(255,255,255,0.05)' }} />
              <div className="ht-bar-bot" style={{ height: `${h * 0.3}%`, backgroundColor: i % 2 === 0 ? habit.color : 'rgba(255,255,255,0.1)' }} />
            </div>
          ))}
        </div>
        <div className="ht-sleep-legend">
          <span className="ht-time-label">11:22 PM</span>
          <span className="ht-time-label">06:52 AM</span>
        </div>
      </div>
    </div>
  );
}

// ── Study Tracker ──────────────────────────────────────────
function StudyTracker({ habit }) {
  const [currentSession] = useState(2);
  const [totalSessions] = useState(6);
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (circumference * 0.65); // Just visual for now

  return (
    <div className="ht-content">
      <div className="ht-study-hero">
        <div className="ht-timer-ring-wrap">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeDasharray="4 4" />
            <motion.circle
              cx="100" cy="100" r="70" fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="ht-timer-display">
            <span className="ht-timer-session">Session {currentSession}/{totalSessions}</span>
            <span className="ht-timer-main">20:00</span>
            <span className="ht-timer-finished">Finished at 10:00 AM</span>
          </div>
        </div>
      </div>

      <div className="ht-timer-controls">
        <button className="ht-stop-btn">Stop</button>
        <button className="ht-icon-btn"><RefreshCw size={20} /></button>
        <button className="ht-icon-btn"><Settings size={20} /></button>
      </div>

      <div className="ht-todo-card">
        <div className="ht-todo-header">
          <h3 className="ht-todo-title">To-do:</h3>
          <div className="ht-chart-period">Today <ChevronDown size={14} /></div>
        </div>
        <div className="ht-todo-list">
          {[
            { text: 'Update CV', done: true },
            { text: 'Apply for Internships', done: false },
            { text: 'Study Group Meeting', done: false },
            { text: 'Grocery Shopping', done: false }
          ].map((item, i) => (
            <div key={i} className={`ht-todo-row ${item.done ? 'done' : ''}`}>
              <div className="ht-todo-check-v2">
                {item.done && <Check size={12} />}
              </div>
              <span className="ht-todo-label-v2">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Mind Tracker ──────────────────────────────────────────
function MindTracker({ habit }) {
  const moods = ['😩', '😔', '😐', '🙂', '😄'];
  const [selectedMood] = useState(3);

  return (
    <div className="ht-content">
      <div className="ht-mind-promo">
        <div className="ht-mind-promo-content">
          <h3 className="ht-mind-promo-title">Manage Stress</h3>
          <p className="ht-mind-promo-sub">
            Regularly practice stress management techniques such as yoga, meditation, or deep breathing exercises.
          </p>
          <button className="ht-mind-promo-btn">Start daily meditation</button>
        </div>
        <div className="ht-mind-promo-img">🧘‍♀️</div>
      </div>

      <div className="ht-mood-tracker-card">
        <div className="ht-mood-tracker-header">
          <h3 className="ht-mood-title">Mood tracker:</h3>
          <div className="ht-chart-period">Week <ChevronDown size={14} /></div>
        </div>
        <div className="ht-mood-graph-row">
          {[
            { mood: 4, pos: 20 },
            { mood: 3, pos: 50 },
            { mood: 2, pos: 60 },
            { mood: 1, pos: 90 },
            { mood: 2, pos: 40 },
            { mood: 4, pos: 10 },
            { mood: 3, pos: 15 }
          ].map((m, i) => (
            <div key={i} className="ht-mood-point-wrap">
              <motion.div
                className="ht-mood-point"
                style={{ bottom: `${m.pos}%`, backgroundColor: i === 3 ? '#ff69b4' : 'rgba(255,255,255,0.1)' }}
              >
                {moods[m.mood]}
              </motion.div>
              <span className="ht-mood-date">1{4+i}/06</span>
            </div>
          ))}
        </div>
      </div>

      <div className="ht-hr-card">
        <div className="ht-hr-header">
          <h3 className="ht-hr-title">Heart rate data:</h3>
          <div className="ht-chart-period">Today <ChevronDown size={14} /></div>
        </div>
        <div className="ht-hr-stats">
          <div className="ht-hr-stat">
            <span className="ht-hr-val">75 bpm</span>
            <span className="ht-hr-label">AVERAGE</span>
          </div>
          <div className="ht-hr-stat">
            <span className="ht-hr-val">54 bpm</span>
            <span className="ht-hr-label">MINIMUM</span>
          </div>
          <div className="ht-hr-stat">
            <span className="ht-hr-val">123 bpm</span>
            <span className="ht-hr-label">MAXIMUM</span>
          </div>
        </div>
        <div className="ht-hr-graph">
          <svg width="100%" height="80" viewBox="0 0 300 80">
            <path
              d="M0 60 Q 50 20, 100 50 T 200 40 T 300 60"
              fill="none"
              stroke="#ff69b4"
              strokeWidth="2"
            />
            <path
              d="M0 60 Q 50 20, 100 50 T 200 40 T 300 60 V 80 H 0 Z"
              fill="url(#hr-grad)"
            />
            <defs>
              <linearGradient id="hr-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff69b4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#ff69b4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function HabitTrackerPage() {
  const { state, dispatch } = useApp();
  const { selectedHabitId } = state;
  const [selectedDate, setSelectedDate] = useState(new Date());

  const habit = state.habits.find(h => h.id === selectedHabitId) || state.habits[0];

  if (!habit) {
    dispatch({ type: 'SET_PAGE', payload: 'habits' });
    return null;
  }

  const renderTracker = () => {
    switch (habit.trackingType) {
      case 'water': return <WaterTracker habit={habit} />;
      case 'sleep': return <SleepTracker habit={habit} />;
      case 'mind': return <MindTracker habit={habit} />;
      case 'study':
      default: return <StudyTracker habit={habit} />;
    }
  };

  return (
    <div className="ht-page-v3">
      {/* Header */}
      <header className="ht-header-v3">
        <button className="ht-back-btn-v3" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="ht-title-v3">{habit.name} tracking</h1>
        <div style={{ width: 36 }} />
      </header>

      {/* Calendar Strip */}
      <div className="ht-calendar-strip-wrap">
        <CalendarStrip
          hideHeader={true}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      {/* Main Content Area */}
      <div className="ht-scroll-content">
        {renderTracker()}
      </div>
    </div>
  );
}
}