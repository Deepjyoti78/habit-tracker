import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Hourglass } from 'lucide-react';
import GrainOverlay from './GrainOverlay';
import './OverallProgressCard.css';

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
        <div className="opc-nebula-gauge-container">
          <div className="opc-nebula-gauge">
            <svg width="96" height="96" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              <motion.circle
                cx="50" cy="50" r="46"
                fill="none"
                stroke="#84cc16"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="289.02"
                initial={{ strokeDashoffset: 289.02 }}
                animate={{ strokeDashoffset: 289.02 - (289.02 * secondaryProgress) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
              />

              <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              <motion.circle
                cx="50" cy="50" r="37"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="232.47"
                initial={{ strokeDashoffset: 232.47 }}
                animate={{ strokeDashoffset: 232.47 - (232.47 * progress) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
              />
            </svg>
            
            <div className="opc-gauge-text">
              <span className="opc-gauge-value">{progress}%</span>
              <span className="opc-gauge-label">met</span>
            </div>
          </div>
        </div>

        <div className="opc-nebula-stats">
          <div className="opc-stat-compact">
            <CheckCircle2 size={12} className="opc-icon yellow" />
            <div className="opc-stat-inline">
              <span className="opc-label">Done</span>
              <span className="opc-val">64/72</span>
            </div>
          </div>

          <div className="opc-stat-compact">
            <Hourglass size={12} className="opc-icon purple" />
            <div className="opc-stat-inline">
              <span className="opc-label">Left</span>
              <span className="opc-val">8 tasks</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
