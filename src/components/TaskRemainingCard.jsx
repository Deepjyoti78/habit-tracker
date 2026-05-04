import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import './TaskRemainingCard.css';

export default function TaskRemainingCard() {
  return (
    <motion.div className="task-remaining-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <div className="trc-body">
        <div className="trc-icon-container">
          <CheckCircle2 size={20} color="var(--text)" />
        </div>
        <div className="trc-text-container">
          <span className="trc-label">Remaining Task</span>
          <span className="trc-sublabel">44 task to go</span>
        </div>
      </div>
    </motion.div>
  );
}
