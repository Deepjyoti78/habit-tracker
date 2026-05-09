import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Hourglass } from 'lucide-react';
import GrainOverlay from './GrainOverlay';
import './OverallProgressCard.css';

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function TrackArc({ r }) {
  const start = polarToCartesian(50, 50, r, 360);
  const end = polarToCartesian(50, 50, r, 0);
  return (
    <path
      d={`M ${start.x} ${start.y} A ${r} ${r} 0 1 0 ${end.x} ${end.y}`}
      fill="none"
      stroke="rgba(255,255,255,0.04)"
      strokeWidth="4"
    />
  );
}

function ProgressArc({ r, progress, color, delay = 0 }) {
  const endAngle = 360 * (progress / 100);
  const d = endAngle <= 0
    ? ''
    : arcPath(50, 50, r, 0, Math.min(endAngle, 359.99));

  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut', delay }}
    />
  );
}

export default function OverallProgressCard() {
  const progress = 89;
  const secondaryProgress = 75;

  return (
    <motion.div
      className="nebula-card overall-progress-nebula"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <GrainOverlay opacity={0.015} />

      <div className="opc-nebula-content">

        <div className="opc-nebula-gauge">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
            <TrackArc r={46} />
            <ProgressArc r={46} progress={secondaryProgress} color="#84cc16" delay={0.2} />
            <TrackArc r={37} />
            <ProgressArc r={37} progress={progress} color="#f59e0b" delay={0} />
          </svg>

          <div className="opc-gauge-text">
            <span className="opc-gauge-value">{progress}%</span>
            <span className="opc-gauge-label">met</span>
          </div>
        </div>

        <div className="opc-nebula-stats">
          <div className="opc-stat-compact">
            <CheckCircle2 size={11} className="opc-icon yellow" />
            <div className="opc-stat-inline">
              <span className="opc-label">done</span>
              <span className="opc-val">64/72</span>
            </div>
          </div>

          <div className="opc-stat-compact">
            <Hourglass size={11} className="opc-icon purple" />
            <div className="opc-stat-inline">
              <span className="opc-label">left</span>
              <span className="opc-val">8 tasks</span>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}