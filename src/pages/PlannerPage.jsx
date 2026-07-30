import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Calendar, MoreHorizontal, Plus, ChevronLeft, MessageSquare, Flag, Briefcase, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './PlannerPage.css';

// --- Main Page ---

const tasksData = [
  {
    group: 'Top priority',
    tasks: [
      {
        id: 1,
        priority: 'High',
        label: 'Zoom Meet',
        title: 'Design team planning',
        time: '9:30 - 10:30 AM',
        due: 'December 20',
        color: '#c4fb31',
      },
      {
        id: 2,
        priority: 'Low',
        label: 'Google Meet',
        title: 'Design team planning',
        time: '9:30 - 10:30 AM',
        due: 'December 20',
        color: '#6c63ff',
      },
    ],
  },
  {
    group: 'Dev today',
    tasks: [
      {
        id: 4,
        priority: 'Low',
        label: 'Google Meet',
        title: 'Backend API review',
        time: '11:00 - 12:00 PM',
        due: 'December 20',
        color: '#6c63ff',
      },
    ],
  },
];

const priorityColors = {
  High: '#c4fb31',
  Medium: '#f59e0b',
  Low: '#6c63ff',
};

function TaskCard({ task, index }) {
  return (
    <motion.div
      className="task-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="task-card-left">
        <div className="task-card-top">
          <span
            className="task-priority-badge"
            style={{ color: priorityColors[task.priority], borderColor: `${priorityColors[task.priority]}33`, background: `${priorityColors[task.priority]}11` }}
          >
            {task.priority}
          </span>
          <span className="task-label-dot" style={{ color: task.color }}>
            ● {task.label}
          </span>
        </div>
        <h3 className="task-title">{task.title}</h3>
        <div className="task-meta">
          <span className="task-meta-item">
            <Clock size={11} />
            {task.time}
          </span>
          <span className="task-meta-item">
            <Calendar size={11} />
            Due: {task.due}
          </span>
        </div>
      </div>
      <div className="task-card-avatars">
        <div className="task-avatar" style={{ background: '#6c63ff' }} />
        <div className="task-avatar" style={{ background: '#c4fb31', marginLeft: '-6px' }} />
      </div>
    </motion.div>
  );
}

function TaskGroup({ group, tasks }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="task-group">
      <button className="task-group-header" onClick={() => setOpen(o => !o)}>
        <span className="task-group-name">{group}</span>
        <div className="task-group-right">
          <span className="task-group-count">{tasks.length} Task</span>
          <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={16} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="task-group-items"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {tasks.map((task, i) => (
              <TaskCard key={task.id} task={task} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PlannerPage() {
  const { state, dispatch } = useApp();
  const handleAddTask = () => {
    dispatch({ type: 'SET_ADD_TASK_MODAL', payload: true });
  };

  const workTypeOptions = [
    { value: 'File Submission', label: 'File Submission', icon: '📁' },
    { value: 'Meeting', label: 'Meeting', icon: '👥' },
    { value: 'Deep Work', label: 'Deep Work', icon: '🎧' },
    { value: 'Review', label: 'Review', icon: '👀' },
  ];

  return (
    <>
      <motion.div
        className="tasks-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <header className="tasks-page-header">
          <button className="tasks-back-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="tasks-page-title">all tasks</h1>
          <div className="header-spacer" />
        </header>

        <div className="tasks-groups">
          <TaskGroup group="Top priority" tasks={state.tasks.filter(t => t.priority === 'High')} />
          <TaskGroup group="Other tasks" tasks={state.tasks.filter(t => t.priority !== 'High')} />
        </div>
      </motion.div>

      {/* FAB */}
      <motion.button
        className="planner-fab"
        whileTap={{ scale: 0.9 }}
        onClick={handleAddTask}
      >
        <Plus size={24} />
      </motion.button>
    </>
  );
}
