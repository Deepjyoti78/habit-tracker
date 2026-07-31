import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CurrentFocusCard.css';

export default function CurrentFocusCard() {
  const { state, dispatch } = useApp();
  const { activeTimer, tasks } = state;
  const [elapsed, setElapsed] = useState(0);

  // Live elapsed timer
  useEffect(() => {
    if (!activeTimer) { setElapsed(0); return; }
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - activeTimer.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Active timer view
  if (activeTimer) {
    const task = tasks.find(t => t.id === activeTimer.taskId);
    if (!task) return null;

    return (
      <div className="cfc-card os-card os-card-accent">
        <div className="cfc-active">
          <div className="cfc-pulse-dot" />
          <div className="cfc-active-info">
            <span className="cfc-active-label">Currently focusing</span>
            <span className="cfc-active-title">{task.title}</span>
          </div>
          <div className="cfc-timer-display">{formatTime(elapsed)}</div>
          <button
            className="cfc-pause-btn"
            onClick={() => dispatch({ type: 'STOP_TIMER' })}
          >
            <Pause size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Next task recommendation
  const nextTask = tasks.find(t => !(t.done || t.status === 'done'));

  if (!nextTask) return null;

  return (
    <motion.div
      className="cfc-card os-card os-card-interactive"
      onClick={() => {
        dispatch({ type: 'SET_SELECTED_TASK', payload: nextTask.id });
        dispatch({ type: 'SET_PAGE', payload: 'workspace' });
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="cfc-next">
        <div className="cfc-next-info">
          <span className="cfc-next-label">Next up</span>
          <span className="cfc-next-title">{nextTask.title}</span>
          {nextTask.estimatedTime && (
            <span className="cfc-next-meta">~{nextTask.estimatedTime}min</span>
          )}
        </div>
        <button
          className="cfc-start-btn"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: 'START_TIMER', payload: nextTask.id });
          }}
        >
          <Play size={16} />
          <span>Start</span>
        </button>
      </div>
    </motion.div>
  );
}
