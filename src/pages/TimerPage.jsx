import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Minus, Plus, Zap, BellOff, Smartphone } from 'lucide-react';
import './TimerPage.css';

export default function TimerPage() {
  const [dnd, setDnd] = useState(true);
  const [aod, setAod] = useState(false);

  return (
    <motion.div 
      className="timer-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <header className="timer-header">
        <button className="timer-back-btn" onClick={() => window.history.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="timer-title">timer settings</h1>
        <div className="header-spacer" />
      </header>

      <div className="timer-duration-grid">
        <div className="duration-card">
          <span className="duration-label">select task</span>
          <div className="duration-value">25</div>
        </div>
        <div className="duration-card">
          <span className="duration-label">short break</span>
          <div className="duration-value">5</div>
        </div>
        <div className="duration-card">
          <span className="duration-label">long break</span>
          <div className="duration-value">15</div>
        </div>
      </div>

      <div className="timer-setting-card session-card">
        <div className="setting-info">
          <div className="setting-icon-wrapper">
            <Clock size={18} />
          </div>
          <div className="setting-text">
            <span className="setting-label">session length</span>
            <span className="setting-sublabel">focus intervals in one session: 4</span>
          </div>
        </div>
        <div className="session-progress-container">
          <div className="session-progress-bar">
            <div className="progress-fill"></div>
            <div className="progress-remaining-stripes"></div>
          </div>
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
            <span className="setting-sublabel">tap anywhere when viewing time to switch to AOD mode</span>
          </div>
        </div>
        <button 
          className={`tp-toggle-track ${aod ? 'active' : ''}`} 
          onClick={() => setAod(!aod)}
        >
          <div className="tp-toggle-thumb"></div>
        </button>
      </div>
    </motion.div>
  );
}
