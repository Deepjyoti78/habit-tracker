import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Calendar } from 'lucide-react';
import GrainOverlay from './GrainOverlay';
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
    title: 'Design Planning: Zoom Sync',
    time: '9:30 - 10:30 am',
    due: 'due: dec 20',
    dotColor: '#c4fb31',
  },
  {
    id: 2,
    priority: 'Low',
    label: 'google meet',
    title: 'Design Planning: Google Sync',
    time: '9:30 - 10:30 am',
    due: 'due: dec 20',
    dotColor: '#6c63ff',
  }
];

export default function TopPriorityCard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="nebula-card nebula-purple top-priority-nebula">
      <GrainOverlay opacity={0.15} />
      
      <button className="tp-nebula-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="tp-nebula-title-group">
          <h3 className="tp-group-name">Top Priority</h3>
          <span className="tp-group-count">{topTasks.length} task</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 0 : -180 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} color="#888" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="tp-nebula-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {topTasks.map((task) => (
              <div key={task.id} className="tp-nebula-task">
                <div className="tp-task-main">
                  <div className="tp-task-tags">
                    <span 
                      className="tp-tag-priority"
                      style={{ 
                        color: priorityColors[task.priority], 
                        background: `${priorityColors[task.priority]}15` 
                      }}
                    >
                      {task.priority.toLowerCase()}
                    </span>
                    <span className="tp-tag-label">
                      <span className="dot" style={{ background: task.dotColor }}></span>
                      {task.label}
                    </span>
                  </div>
                  <h4 className="tp-task-title">{task.title}</h4>
                  <div className="tp-task-info">
                    <span className="info-item"><Clock size={12} /> {task.time}</span>
                    <span className="info-item"><Calendar size={12} /> {task.due}</span>
                  </div>
                </div>
                
                <div className="tp-task-action">
                  <div className="tp-nebula-switch">
                    <div className="switch-thumb"></div>
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
