import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Check, CheckCircle2, Circle, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './HabitCard.css';

const COLORS = ['#f87171', '#34d399', '#a78bfa', '#fbbf24', '#60a5fa'];

const FILTERS = [
  { key: 'all',        label: 'All' },
  { key: 'urgent',     label: 'Urgent' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'done',       label: 'Done' },
];

function getTaskStatus(task) {
  if (task.done || task.status === 'done') return 'done';
  if (task.inProgress || task.status === 'inprogress') return 'inprogress';
  return 'urgent';
}

function Checkbox({ checked, color, onClick }) {
  return (
    <motion.button
      className={`hc-checkbox${checked ? ' hc-checkbox--checked' : ''}`}
      onClick={onClick}
      aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
      style={checked ? { '--task-color': color } : {}}
      whileTap={{ scale: 0.85 }}
      transition={{ duration: 0.12 }}
    >
      <AnimatePresence initial={false}>
        {checked && (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.15, ease: 'backOut' }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Check size={11} strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function HabitCard() {
  const { state, dispatch } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');
  const tasks = state.tasks || [];

  const counts = {
    all:        tasks.length,
    urgent:     tasks.filter(t => getTaskStatus(t) === 'urgent').length,
    inprogress: tasks.filter(t => getTaskStatus(t) === 'inprogress').length,
    done:       tasks.filter(t => getTaskStatus(t) === 'done').length,
  };

  const filtered = activeFilter === 'all'
    ? tasks
    : tasks.filter(t => getTaskStatus(t) === activeFilter);

  const getColor = (task, idx) => task.color || COLORS[idx % COLORS.length];

  return (
    <div className="hc-card">
      {/* Filter pills */}
      <div className="hc-filter-bar">
        {FILTERS.map(f => {
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              className={`hc-filter-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              <span className="hc-filter-label">{f.label}</span>
              <span className="hc-filter-count">{counts[f.key]}</span>
            </button>
          );
        })}
      </div>

      {/* Task list */}
      <div className="hc-list">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              className="hc-empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="hc-empty-icon-wrapper">
                <Target size={20} strokeWidth={1.5} />
              </div>
              <span className="hc-empty-title">
                {activeFilter === 'all'        && 'no tasks yet'}
                {activeFilter === 'urgent'     && 'no urgent tasks'}
                {activeFilter === 'inprogress' && 'nothing in progress'}
                {activeFilter === 'done'       && 'no completed tasks'}
              </span>
              <span className="hc-empty-subtitle">tasks will appear here</span>
              {(activeFilter === 'all' || activeFilter === 'urgent') && (
                <button
                  className="hc-add-first-btn"
                  onClick={() => dispatch({ type: 'SET_ADD_TASK_MODAL', payload: true })}
                >
                  <Plus size={13} strokeWidth={2.5} />
                  add task
                </button>
              )}
            </motion.div>
          ) : (
            filtered.map((task, idx) => {
              const name = task.title || task.name || 'New Task';
              const color = getColor(task, idx);
              const isDone = task.done || task.status === 'done';
              const status = getTaskStatus(task);

              return (
                <motion.div
                  key={task.id || idx}
                  className={`hc-row ${isDone ? 'hc-row--done' : ''}`}
                  onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  layout
                >
                  {/* Color bar */}
                  <span className="hc-row-bar" style={{ background: color }} />

                  {/* Number badge */}
                  <div
                    className={`hc-num ${isDone ? 'hc-num--done' : ''}`}
                    style={{ '--num-color': color }}
                  >
                    {idx + 1}
                  </div>

                  {/* Text */}
                  <div className="hc-info">
                    <span className={`hc-name ${isDone ? 'hc-name--done' : ''}`}>
                      {name}
                    </span>
                    {isDone && (
                      <span className="hc-sub hc-sub--done">completed</span>
                    )}
                    {status === 'inprogress' && !isDone && (
                      <span className="hc-sub hc-sub--progress">in progress</span>
                    )}
                  </div>

                  {/* Checkbox */}
                  <Checkbox
                    checked={isDone}
                    color={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: 'TOGGLE_TASK', payload: task.id });
                    }}
                  />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}