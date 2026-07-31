import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import './TodaysPlanCard.css';

export default function TodaysPlanCard() {
  const { state } = useApp();
  const { tasks } = state;

  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  // SVG ring dimensions
  const SIZE   = 72;
  const CX     = SIZE / 2;
  const STROKE = 6;
  const R      = CX - STROKE;
  const CIRC   = 2 * Math.PI * R;
  const arcLen = CIRC * (pct / 100);

  return (
    <motion.div
      className="tpc-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.35 }}
    >
      {/* Left content */}
      <div className="tpc-left">
        <span className="tpc-label">Today's Plan</span>
        <span className="tpc-sub">{done}/{total} tasks completed</span>
      </div>

      {/* Right — circular progress */}
      <div className="tpc-ring-wrap">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="tpc-ring-svg"
        >
          {/* Track */}
          <circle
            cx={CX} cy={CX} r={R}
            fill="none"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth={STROKE}
          />
          {/* Progress arc */}
          <circle
            cx={CX} cy={CX} r={R}
            fill="none"
            stroke="#000"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${CIRC}`}
            transform={`rotate(-90 ${CX} ${CX})`}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div className="tpc-pct-label">{pct}%</div>
      </div>
    </motion.div>
  );
}
