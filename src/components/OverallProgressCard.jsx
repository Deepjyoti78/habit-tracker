import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap } from 'lucide-react';
import GrainOverlay from './GrainOverlay';
import './OverallProgressCard.css';

export default function OverallProgressCard() {
  const progress = 89;
  
  return (
    <motion.div 
      className="nebula-card nebula-orange overall-progress-nebula" 
      initial={{ opacity: 0, y: 12 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.1 }}
    >
      <GrainOverlay opacity={0.15} />
      
      <div className="opc-nebula-content">
        <div className="opc-nebula-gauge">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="opcGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <motion.circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="url(#opcGrad)" 
              strokeWidth="10" 
              strokeLinecap="round" 
              strokeDasharray="263.89" 
              initial={{ strokeDashoffset: 263.89 }}
              animate={{ strokeDashoffset: 263.89 - (263.89 * progress) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              filter="url(#glow)"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <div className="opc-nebula-value">{progress}%</div>
        </div>

        <div className="opc-nebula-stats">
          <div className="opc-stat-row">
            <Zap size={16} className="opc-icon orange" />
            <div className="opc-stat-text">
              <span className="opc-stat-val">6 tasks</span>
              <span className="opc-stat-label">in progress</span>
            </div>
          </div>
          
          <div className="opc-stat-row">
            <CheckCircle2 size={16} className="opc-icon red" />
            <div className="opc-stat-text">
              <span className="opc-stat-val">22/72 tasks</span>
              <span className="opc-stat-label">finished (44 remaining)</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
