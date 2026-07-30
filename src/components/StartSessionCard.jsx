import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import './StartSessionCard.css';

export default function StartSessionCard() {
  return (
    <motion.div
      className="nebula-card start-session-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="ssc-content">
        <h3 className="ssc-title">Daily Therapy Plan</h3>
        <p className="ssc-subtitle">Shoulder Mobility Routine</p>
        <span className="ssc-duration">15–20 mins</span>
      </div>

      <button className="ssc-start-btn">
        <span>Start Session</span>
        <div className="ssc-play-icon">
          <Play size={12} fill="currentColor" />
        </div>
      </button>
    </motion.div>
  );
}
