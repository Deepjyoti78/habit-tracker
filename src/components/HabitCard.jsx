import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GrainOverlay from './GrainOverlay';
import './HabitCard.css';

const COLORS = ['#ef4444', '#22c55e', '#a855f7', '#f59e0b', '#3b82f6'];

function PulseIcon({ color }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  );
}

export default function HabitCard() {
  const { state, dispatch } = useApp();
  const tasks = state.tasks.slice(0, 5);

  const getColor = (task, idx) => {
    return task.color || COLORS[idx % COLORS.length];
  };

  return (
    <div className="hc-card">

      <div className="hc-header">
        <span className="hc-title">today's tasks</span>
      </div>

      <div className="hc-list">
        {tasks.length === 0 ? (
          <div className="hc-empty-state">
            <div className="hc-empty-icon-wrapper">
              <Target size={24} strokeWidth={2} />
            </div>
            <span className="hc-empty-title">no tasks yet</span>
            <span className="hc-empty-subtitle">time to build some momentum</span>
            <button 
              className="hc-add-first-btn" 
              onClick={() => dispatch({ type: 'SET_ADD_TASK_MODAL', payload: true })}
            >
              <Plus size={16} strokeWidth={3} />
              add first task
            </button>
          </div>
        ) : (
          tasks.map((task, idx) => {
            const name = task.title || task.name || 'New Task';
            const color = getColor(task, idx);
            const isDone = task.done;

            return (
              <div key={task.id || idx} className="hc-row">
                <div className="hc-icon">
                  <PulseIcon color={color} />
                </div>

                <div className="hc-info">
                  <span className="hc-name">{name}</span>
                  <span className="hc-sub">
                    {isDone ? 'completed' : 'pending'}
                  </span>
                </div>

                <button
                  className={`hc-plus${isDone ? ' done' : ''}`}
                  onClick={() =>
                    dispatch({ type: 'TOGGLE_TASK', payload: task.id })
                  }
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={isDone ? 'done' : 'plus'}
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {isDone ? (
                        <Check size={11} strokeWidth={3} />
                      ) : (
                        <Plus size={11} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}