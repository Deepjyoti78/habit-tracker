import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ChevronRight } from 'lucide-react';
import { getIcon } from '../utils/iconMap';
import './HabitLargeCard.css';

// Fallback color map to ensure user sees unique colors even with legacy state
const colorMap = {
  'drink water': '#3b82f6',
  'morning run': '#f97316',
  'read 20 min': '#c4fb31',
  'gym': '#ec4899',
  'meditate': '#8b5cf6',
  'no social media': '#ff4b4b'
};

export default function HabitLargeCard({ habit }) {
  // Use habit.color if it exists, otherwise use fallback map or default to lime
  const habitColor = habit.color || colorMap[habit.name?.toLowerCase()] || '#c4fb31';
  
  // Handling metrics data from either legacy state or new structure
  const progress = habit.progress !== undefined ? habit.progress : (habit.done ? 100 : 45);
  const target = habit.targetValue || 10;
  const current = habit.currentValue || (habit.done ? 10 : 4);
  const unit = habit.unit || (habit.target?.includes('glasses') ? 'glasses' : 'units');
  
  const IconComponent = getIcon(habit.icon || (habit.emoji ? null : 'activity'));
  
  return (
    <motion.div 
      className="habit-large-card"
      whileTap={{ scale: 0.98 }}
    >
      <div className="h-card-header-row">
        <div className="h-card-left-content">
          <div className="h-card-icon-wrapper" style={{ backgroundColor: `${habitColor}15`, borderColor: `${habitColor}25` }}>
            {habit.emoji ? (
              <span className="h-card-emoji">{habit.emoji}</span>
            ) : (
              <IconComponent size={18} color={habitColor} />
            )}
          </div>
          <div className="h-card-text-stack">
            <h3 className="h-card-main-title">{habit.name}</h3>
            <p className="h-card-sub-label">{habit.desc || habit.target || 'stay consistent, feel better'}</p>
          </div>
        </div>
        <div className="h-card-streak-pill">
          <Flame size={12} fill="#f97316" color="#f97316" />
          <span className="h-streak-count">{habit.streak || 0}</span>
        </div>
      </div>

      <div className="h-card-body-metrics">
        <div className="h-card-metric-main">
          <div className="h-card-stat-display">
            <span className="h-stat-big">{current}</span>
            <span className="h-stat-small">of {target} {unit}</span>
          </div>
          <div className="h-card-progress-track">
            <motion.div 
              className="h-card-progress-bar" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ backgroundColor: habitColor }}
            />
          </div>
        </div>

        <div className="h-card-circular-progress">
          <svg width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <motion.circle 
              cx="20" cy="20" r="18" fill="none" 
              stroke={habitColor} 
              strokeWidth="3" 
              strokeDasharray="113"
              initial={{ strokeDashoffset: 113 }}
              animate={{ strokeDashoffset: 113 - (113 * progress) / 100 }}
              strokeLinecap="round"
              transform="rotate(-90 20 20)"
            />
          </svg>
          <span className="h-percentage-text">{progress}%</span>
        </div>
      </div>

      <div className="h-card-bottom-footer">
        <button className="h-view-tracker-link">
          <span>view tracker</span>
          <ChevronRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}
