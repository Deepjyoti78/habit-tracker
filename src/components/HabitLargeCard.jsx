import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, ChevronRight, Plus, Minus, ArrowUpRight } from 'lucide-react';
import { logHabit } from '../api/habits';
import { useApp } from '../context/AppContext';
import { Heart, Palette, Trophy, Target, Globe, Sprout, Activity, Star } from 'lucide-react';
import './HabitLargeCard.css';

const iconMap = {
  health: Heart, arts: Palette, sport: Trophy,
  skills: Target, language: Globe, mindfulness: Sprout,
  custom: Activity, activity: Activity,
};

const catColorMap = {
  health: '#ff4b4b', arts: '#6c63ff', sport: '#f97316',
  skills: '#10b981', language: '#3b82f6', mindfulness: '#8b5cf6', custom: '#CCFF00',
};

export default function HabitLargeCard({ habit }) {
  const { dispatch } = useApp();
  const habitColor = habit.color || catColorMap[habit.category] || '#CCFF00';
  const target = habit.target_value || 1;

  const [current, setCurrent] = useState(habit.current_value || 0);
  const [saving, setSaving] = useState(false);

  const progress = Math.min(Math.round((current / target) * 100), 100);
  const isDone = progress >= 100;

  const IconComponent = iconMap[habit.emoji] || iconMap[habit.category] || Activity;

  const handleLog = async (newVal) => {
    const clamped = Math.max(0, Math.min(newVal, target));
    setCurrent(clamped);
    setSaving(true);
    try {
      await logHabit(habit.id, {
        current_value: clamped,
        target_value: target,
        done: clamped >= target,
      });
      dispatch({
        type: 'UPDATE_HABIT',
        payload: { ...habit, current_value: clamped }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className={`habit-large-card ${isDone ? 'habit-done' : ''}`}
      style={{ borderColor: isDone ? `${habitColor}40` : 'var(--border)' }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Header */}
      <div className="h-card-header-row">
        <div className="h-card-left-content">
          <div className="h-card-icon-wrapper" style={{ backgroundColor: `${habitColor}18` }}>
            <IconComponent size={17} color={habitColor} />
          </div>
          <div className="h-card-text-stack">
            <div className="h-card-name-row">
              <h3 className="h-card-main-title">{habit.name}</h3>
              {habit.is_core && <Star size={11} fill="#CCFF00" color="#CCFF00" />}
            </div>
            <p className="h-card-sub-label">
              {habit.frequency || 'every day'} · {target} {habit.unit || 'times'} / day
            </p>
          </div>
        </div>
        <div className="h-card-streak-pill">
          <Flame size={12} fill="#f97316" color="#f97316" />
          <span className="h-streak-count">{habit.streak || 0}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="h-card-body-metrics">
        <div className="h-card-metric-main">
          <div className="h-card-stat-display">
            <span className="h-stat-big" style={{ color: isDone ? habitColor : '#fff' }}>{current}</span>
            <span className="h-stat-small">of {target} {habit.unit || 'times'}</span>
            {isDone && <span className="h-done-badge">✓ done</span>}
          </div>
          <div className="h-card-progress-track">
            <motion.div
              className="h-card-progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ backgroundColor: habitColor }}
            />
          </div>
        </div>

        {/* Circular progress */}
        <div className="h-card-circular-progress">
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <motion.circle
              cx="22" cy="22" r="18" fill="none"
              stroke={habitColor}
              strokeWidth="3"
              strokeDasharray="113"
              initial={{ strokeDashoffset: 113 }}
              animate={{ strokeDashoffset: 113 - (113 * progress) / 100 }}
              transition={{ duration: 0.4 }}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
            />
          </svg>
          <span className="h-percentage-text" style={{ color: isDone ? habitColor : '#fff' }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Footer — log buttons + tracker link */}
      <div className="h-card-bottom-footer">
        <div className="h-log-controls">
          <button
            className="h-log-btn minus"
            onClick={() => handleLog(current - 1)}
            disabled={current <= 0 || saving}
          >
            <Minus size={12} />
          </button>
          <span className="h-log-label">{saving ? '...' : 'log progress'}</span>
          <button
            className="h-log-btn plus"
            onClick={() => handleLog(current + 1)}
            disabled={current >= target || saving}
            style={{ backgroundColor: current < target ? `${habitColor}22` : '#1a1a1a', color: habitColor }}
          >
            <Plus size={12} />
          </button>
        </div>
        
        {/* NEW Circular Boundary Button */}
        <motion.button
          className="h-circular-view-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            dispatch({ type: 'SET_SELECTED_HABIT', payload: habit.id });
            dispatch({ type: 'SET_PAGE', payload: 'tracker' });
          }}
          title="View Tracker"
        >
          <ArrowUpRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}