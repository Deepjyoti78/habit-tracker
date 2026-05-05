import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Calendar } from 'lucide-react';
import './TopPriorityCard.css';

const priorityColors = {
  High: '#c4fb31',
  Medium: '#f59e0b',
  Low: '#6c63ff',
};

const topTasks = [
  {
    id: 1,
    priority: 'High',
    label: 'zoom meet',
    title: 'design team planning',
    time: '9:30 - 10:30 am',
    due: 'due: december 20',
    dotColor: '#c4fb31',
  },
  {
    id: 2,
    priority: 'Low',
    label: 'google meet',
    title: 'design team planning',
    time: '9:30 - 10:30 am',
    due: 'due: december 20',
    dotColor: '#6c63ff',
  }
];

export default function TopPriorityCard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="top-priority-container">
      <button className="tp-group-header" onClick={() => setIsOpen(!isOpen)}>
        <span className="tp-group-name">top priority</span>
        <div className="tp-group-right">
          <span className="tp-group-count">{topTasks.length} task</span>
          <motion.div animate={{ rotate: isOpen ? 0 : -90 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="tp-group-items"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {topTasks.map((task) => (
              <div key={task.id} className="tp-task-item">
                <div className="tp-task-left">
                  <div className="tp-task-header">
                    <span 
                      className="tp-priority-badge"
                      style={{ 
                        color: priorityColors[task.priority], 
                        borderColor: `${priorityColors[task.priority]}33`,
                        background: `${priorityColors[task.priority]}11` 
                      }}
                    >
                      {task.priority.toLowerCase()}
                    </span>
                    <span className="tp-label-dot">
                      <span className="dot" style={{ background: task.dotColor }}></span>
                      {task.label}
                    </span>
                  </div>
                  <h3 className="tp-task-title">{task.title}</h3>
                  <div className="tp-task-meta">
                    <span className="tp-meta-item">
                      <Clock size={12} />
                      {task.time}
                    </span>
                    <span className="tp-meta-item">
                      <Calendar size={12} />
                      {task.due}
                    </span>
                  </div>
                </div>
                
                <div className="tp-task-right">
                  <div className="tp-toggle-container">
                    <div className="tp-toggle-track">
                      <div className="tp-toggle-thumb"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
