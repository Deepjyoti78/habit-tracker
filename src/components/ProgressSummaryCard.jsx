import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import './ProgressSummaryCard.css';

export default function ProgressSummaryCard() {
  const { state } = useApp();
  const tasks = state.tasks || [];
  const total = tasks.length;
  const completed = tasks.filter(t => t.done || t.status === 'done').length;
  const remaining = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Estimate focus time from remaining tasks
  const remainingMinutes = tasks
    .filter(t => !(t.done || t.status === 'done'))
    .reduce((sum, t) => sum + (t.estimatedTime || 30), 0);
  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;
  const focusLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  // SVG ring
  const size = 64;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="psc-card os-card">
      <div className="psc-content">
        <div className="psc-text">
          <h3 className="psc-title">Today's Progress</h3>
          <div className="psc-stats">
            <span className="psc-stat">
              <span className="psc-stat-value">{completed}</span>
              <span className="psc-stat-label">done</span>
            </span>
            <span className="psc-stat-divider" />
            <span className="psc-stat">
              <span className="psc-stat-value">{remaining}</span>
              <span className="psc-stat-label">left</span>
            </span>
            <span className="psc-stat-divider" />
            <span className="psc-stat">
              <span className="psc-stat-value">~{focusLabel}</span>
              <span className="psc-stat-label">focus</span>
            </span>
          </div>
        </div>

        <div className="psc-ring-wrap">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--surface3)"
              strokeWidth={stroke}
            />
            {/* Fill */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="var(--accent, #C7FF2A)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <span className="psc-ring-label">{percent}%</span>
        </div>
      </div>
    </div>
  );
}
