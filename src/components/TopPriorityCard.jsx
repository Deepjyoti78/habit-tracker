import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Calendar, Sparkles, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GrainOverlay from './GrainOverlay';
import './TopPriorityCard.css';

const priorityColors = {
  High: '#c4fb31',
  Medium: '#f59e0b',
  Low: '#6c63ff',
};

function TaskRow({ task }) {
  return (
    <div className="tp-task-row">
      <div className="tp-task-left">
        <div className="tp-task-status" style={{ background: priorityColors[task.priority] }} />
        <div className="tp-task-info">
          <span className="tp-task-name">{task.title}</span>
          <span className="tp-task-time">{task.time}</span>
        </div>
      </div>
      <div className="tp-task-badge" style={{ color: priorityColors[task.priority], borderColor: `${priorityColors[task.priority]}33` }}>
        {task.priority.toLowerCase()}
      </div>
    </div>
  );
}

export default function TopPriorityCard() {
  const [isOpen, setIsOpen] = useState(true);
  const { state, dispatch } = useApp();
  
  // Filter for high priority tasks only for the home page "Top Priority" card
  const topTasks = state.tasks.filter(t => t.priority === 'High');

  const handleAddTask = () => {
    dispatch({ type: 'SET_ADD_TASK_MODAL', payload: true });
  };

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
            {topTasks.length > 0 ? (
              <div className="tp-tasks-list">
                {topTasks.map(task => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="tp-empty-state">
                <div className="tp-empty-icon-box">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles size={22} color="#c4fb31" strokeWidth={1.5} />
                  </motion.div>
                  <div className="tp-icon-glow"></div>
                </div>
                <h4 className="tp-empty-title">no priorities set</h4>
                <p className="tp-empty-desc">your most important tasks will appear here for quick access</p>
                <button 
                  className="tp-add-btn" 
                  onClick={handleAddTask}
                >
                  <Plus size={16} strokeWidth={3} />
                  add new task
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
