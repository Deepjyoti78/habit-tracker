import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
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
  const habits = state.habits.slice(0, 5);

  const getColor = (habit, idx) => {
    return habit.color || COLORS[idx % COLORS.length];
  };

  return (
    <div className="hc-card">

      <div className="hc-header">
        <span className="hc-title">my disciplines</span>
      </div>

      <div className="hc-list">
        {habits.map((habit, idx) => {
          const name = habit.name || habit.title || 'New Habit';
          const color = getColor(habit, idx);
          const isDone = habit.done;

          return (
            <div key={habit.id || idx} className="hc-row">
              <div className="hc-icon">
                <PulseIcon color={color} />
              </div>

              <div className="hc-info">
                <span className="hc-name">{name}</span>
                <span className="hc-sub">
                  {isDone
                    ? 'completed'
                    : `${habit.progress || 0}/${habit.target_value || 1}`}
                </span>
              </div>

              <button
                className={`hc-plus${isDone ? ' done' : ''}`}
                onClick={() =>
                  dispatch({ type: 'TOGGLE_HABIT', payload: habit.id })
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
        })}
      </div>
    </div>
  );
}