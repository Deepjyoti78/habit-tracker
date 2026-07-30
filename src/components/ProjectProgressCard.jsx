import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ProjectProgressCard.css';

export default function ProjectProgressCard() {
  const { state } = useApp();
  
  // Calculate progress based on today's tasks
  const tasks = state.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.done).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.div
      className="nebula-card project-progress-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      {/* Title Area */}
      <div className="ppc-title-row">
        <h3 className="ppc-title">Today's Progress</h3>
        <span className="ppc-pill">Daily goals</span>
      </div>

      {/* Large Percentage */}
      <div className="ppc-percentage">
        {progress}<span>%</span>
      </div>

      {/* Progress Bar Area */}
      <div className="ppc-progress-container">
        <div className="ppc-progress-track">
          <motion.div
            className="ppc-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Footer Area */}
      <div className="ppc-footer">
        <div className="ppc-collaborators-section">
          <span className="ppc-collab-text">
            {completedTasks} of {totalTasks} tasks completed
          </span>
        </div>

        <button className="ppc-details-btn">
          View all <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}
