import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Minus, Plus, BellOff, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './TimerPage.css';

export default function TimerPage() {
  const { dispatch } = useApp();
  const [dnd, setDnd] = useState(true);
  const [aod, setAod] = useState(false);
  
  // Functional States
  const [focusTime, setFocusTime] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [sessionCount, setSessionCount] = useState(4);

  const adjust = (setter, val, delta, min = 1, max = 60) => {
    const next = val + delta;
    if (next >= min && next <= max) setter(next);
  };

  return (
    <motion.div 
      className="timer-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className="timer-header">
        <button className="timer-back-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="timer-title">timer settings</h1>
        <div className="header-spacer" />
      </header>

      <div className="timer-duration-grid">
        <div className="duration-card">
          <span className="duration-label">select task</span>
          <div className="duration-controls">
            <button onClick={() => adjust(setFocusTime, focusTime, -1)}><Minus size={14} /></button>
            <div className="duration-value">{focusTime}</div>
            <button onClick={() => adjust(setFocusTime, focusTime, 1)}><Plus size={14} /></button>
          </div>
        </div>
        
        <div className="duration-card">
          <span className="duration-label">short break</span>
          <div className="duration-controls">
            <button onClick={() => adjust(setShortBreak, shortBreak, -1)}><Minus size={14} /></button>
            <div className="duration-value">{shortBreak}</div>
            <button onClick={() => adjust(setShortBreak, shortBreak, 1)}><Plus size={14} /></button>
          </div>
        </div>

        <div className="duration-card">
          <span className="duration-label">long break</span>
          <div className="duration-controls">
            <button onClick={() => adjust(setLongBreak, longBreak, -1)}><Minus size={14} /></button>
            <div className="duration-value">{longBreak}</div>
            <button onClick={() => adjust(setLongBreak, longBreak, 1)}><Plus size={14} /></button>
          </div>
        </div>
      </div>

      <div className="timer-setting-card session-card">
        <div className="setting-info">
          <div className="setting-icon-wrapper">
            <Clock size={18} />
          </div>
          <div className="setting-text">
            <span className="setting-label">session length</span>
            <span className="setting-sublabel">focus intervals: {sessionCount}</span>
          </div>
        </div>
        <div className="session-adjust-row">
          <button className="session-adj-btn" onClick={() => adjust(setSessionCount, sessionCount, -1, 1, 12)}>
            <Minus size={16} />
          </button>
          <div className="session-progress-container">
            <div className="session-progress-bar">
              <div className="progress-fill" style={{ width: `${(sessionCount / 12) * 100}%` }}></div>
              <div className="progress-remaining-stripes"></div>
            </div>
          </div>
          <button className="session-adj-btn" onClick={() => adjust(setSessionCount, sessionCount, 1, 1, 12)}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="timer-setting-card interactive">
        <div className="setting-info">
          <div className="setting-icon-wrapper">
            <BellOff size={18} />
          </div>
          <div className="setting-text">
            <span className="setting-label">do not disturb</span>
            <span className="setting-sublabel">turn on DND when running a focus timer</span>
          </div>
        </div>
        <button 
          className={`tp-toggle-track ${dnd ? 'active' : ''}`} 
          onClick={() => setDnd(!dnd)}
        >
          <div className="tp-toggle-thumb"></div>
        </button>
      </div>

      <div className="tomato-plus-banner">
        <span>customize further with tomato +</span>
      </div>

      <div className="timer-setting-card interactive">
        <div className="setting-info">
          <div className="setting-icon-wrapper">
            <Smartphone size={18} />
          </div>
          <div className="setting-text">
            <span className="setting-label">always on display</span>
            <span className="setting-sublabel">tap anywhere to switch to AOD mode</span>
          </div>
        </div>
        <button 
          className={`tp-toggle-track ${aod ? 'active' : ''}`} 
          onClick={() => setAod(!aod)}
        >
          <div className="tp-toggle-thumb"></div>
        </button>
      </div>

      <button className="start-timer-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'tracker' })}>
        start timer
      </button>
    </motion.div>
  );
}
