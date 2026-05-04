import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import './RemainingTasksCard.css';

export default function RemainingTasksCard() {
  return (
    <motion.div className="remaining-tasks-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <div className="rtc-body">
        <div className="rtc-icon-container">
          <Loader size={20} className="animate-spin-slow" color="var(--text)" />
        </div>
        <div className="rtc-text-container">
          <span className="rtc-label">In Progress</span>
          <span className="rtc-sublabel">6 task remaining</span>
        </div>
      </div>
    </motion.div>
  );
}
