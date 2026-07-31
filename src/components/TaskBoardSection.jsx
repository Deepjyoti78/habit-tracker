import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Zap, Timer, Sparkles, Plus, LayoutGrid } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './TaskBoardSection.css';

/* ─── filter definitions ─────────────────────────────────── */
const FILTERS = [
  { key: 'all',        label: 'All',         icon: LayoutGrid   },
  { key: 'urgent',     label: 'Urgent',      icon: Zap          },
  { key: 'inprogress', label: 'In Progress', icon: Timer        },
  { key: 'done',       label: 'Done',        icon: CheckCircle2 },
];



const priorityColors = {
  High:   '#f87171',
  Medium: '#fbbf24',
  Low:    '#a89bff',
};

function getTaskStatus(task) {
  if (task.done)       return 'done';
  if (task.inProgress) return 'inprogress';
  return 'urgent';
}

/* ─── single task row ─────────────────────────────────────── */
function TaskRow({ task }) {
  const { dispatch } = useApp();
  const status = getTaskStatus(task);
  const accentColor = task.color || priorityColors[task.priority] || '#c4fb31';

  const handleToggleDone = () => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: task.done
        ? { ...task, done: false, inProgress: false }
        : { ...task, done: true,  inProgress: false },
    });
  };

  const handleToggleInProgress = () => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: task.inProgress
        ? { ...task, inProgress: false }
        : { ...task, inProgress: true, done: false },
    });
  };

  return (
    <motion.div
      className={`tbs-row tbs-row-${status}`}
      style={{ '--accent': accentColor }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.96 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      layout
    >
      <span className="tbs-row-bar" />

      <button
        className={`tbs-row-check ${task.done ? 'checked' : ''}`}
        onClick={handleToggleDone}
      >
        {task.done ? <CheckCircle2 size={17} /> : <Circle size={17} />}
      </button>

      <span className={`tbs-row-title ${task.done ? 'done' : ''}`}>{task.title}</span>

      {!task.done && (
        <button
          className={`tbs-row-timer ${task.inProgress ? 'active' : ''}`}
          onClick={handleToggleInProgress}
          title="Toggle in progress"
        >
          <Timer size={13} />
        </button>
      )}
    </motion.div>
  );
}

/* ─── main component ──────────────────────────────────────── */
export default function TaskBoardSection() {
  const [active, setActive] = useState('all');
  const { state, dispatch } = useApp();
  const { tasks } = state;

  const counts = {
    all:        tasks.length,
    urgent:     tasks.filter(t => getTaskStatus(t) === 'urgent').length,
    inprogress: tasks.filter(t => getTaskStatus(t) === 'inprogress').length,
    done:       tasks.filter(t => getTaskStatus(t) === 'done').length,
  };

  const filtered = active === 'all'
    ? tasks
    : tasks.filter(t => getTaskStatus(t) === active);

  const handleAdd = () => dispatch({ type: 'SET_ADD_TASK_MODAL', payload: true });

  return (
    <div className="tbs-wrap">

      {/* ── filter button bar ────────────────────────────── */}
      <div className="tbs-pill-bar">
        {FILTERS.map(f => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              className={`tbs-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActive(f.key)}
            >
              <span className="tbs-pill-label">{f.label}</span>
              <span className="tbs-pill-count">{counts[f.key]}</span>
            </button>
          );
        })}
      </div>

      {/* ── task list ───────────────────────────────────── */}
      <div className="tbs-list">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map(task => <TaskRow key={task.id} task={task} />)
          ) : (
            <motion.div
              key="empty"
              className="tbs-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="tbs-empty-icon"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 6, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkles size={17} color="#c4fb31" strokeWidth={1.5} />
              </motion.div>
              <p className="tbs-empty-text">
                {active === 'all'        && 'no tasks yet — add one!'}
                {active === 'urgent'     && 'no urgent tasks right now'}
                {active === 'inprogress' && 'nothing in progress yet'}
                {active === 'done'       && 'no completed tasks yet'}
              </p>
              {(active === 'all' || active === 'urgent') && (
                <button className="tbs-add-btn" onClick={handleAdd}>
                  <Plus size={13} strokeWidth={3} /> add task
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
