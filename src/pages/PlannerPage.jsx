import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { plannerItems } from '../data/appData';
import './PlannerPage.css';

const categoryColors = {
  health: 'var(--green)',
  fitness: 'var(--pink)',
  work: 'var(--accent)',
  personal: 'var(--amber)',
  growth: 'var(--cyan)',
  focus: 'var(--amber)',
};

const categoryEmojis = {
  health: '🍃',
  fitness: '💪',
  work: '💻',
  personal: '🏠',
  growth: '📚',
  focus: '🎯',
};

export default function PlannerPage() {
  const { dispatch } = useApp();

  const doneCount = plannerItems.filter((p) => p.status === 'done').length;
  const activeItem = plannerItems.find((p) => p.status === 'active');

  const handleFocusTask = (text) => {
    dispatch({ type: 'SHOW_TOAST', payload: `Focusing on: ${text}` });
  };

  return (
    <motion.div
      className="planner-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Today's Planner</h1>
          <p className="page-subtitle">
            {doneCount} of {plannerItems.length} tasks completed
          </p>
        </div>
      </div>

      {/* Current focus */}
      {activeItem && (
        <motion.div
          className="planner-focus-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="planner-focus-header">
            <Clock size={14} />
            <span>Currently Focused</span>
          </div>
          <div className="planner-focus-content">
            <span className="planner-focus-emoji">
              {categoryEmojis[activeItem.category] || '📌'}
            </span>
            <div className="planner-focus-info">
              <span className="planner-focus-text">{activeItem.text}</span>
              <span className="planner-focus-time">
                Started at {activeItem.time}
              </span>
            </div>
            <button
              className="planner-focus-btn"
              onClick={() => handleFocusTask(activeItem.text)}
            >
              Focus Mode
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <div className="planner-timeline">
        {plannerItems.map((item, i) => (
          <motion.div
            key={item.id}
            className={`planner-timeline-item ${item.status}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.04 }}
            onClick={() => handleFocusTask(item.text)}
          >
            {/* Timeline connector */}
            <div className="planner-timeline-col">
              <div
                className="planner-timeline-dot"
                style={{ '--dot-color': categoryColors[item.category] || 'var(--accent)' }}
              >
                {item.status === 'done' ? (
                  <CheckCircle2 size={16} />
                ) : item.status === 'active' ? (
                  <div className="planner-timeline-active-dot" />
                ) : (
                  <Circle size={16} />
                )}
              </div>
              {i < plannerItems.length - 1 && (
                <div
                  className={`planner-timeline-line ${item.status === 'done' ? 'done' : ''}`}
                />
              )}
            </div>

            {/* Content */}
            <div className="planner-timeline-content">
              <div className="planner-timeline-top">
                <span className="planner-timeline-time">{item.time}</span>
                <span
                  className="planner-timeline-cat"
                  style={{ color: categoryColors[item.category] }}
                >
                  {item.category}
                </span>
              </div>
              <span className="planner-timeline-text">{item.text}</span>
              {item.status === 'active' && (
                <div className="planner-timeline-active-badge">
                  <div className="planner-active-pulse" />
                  In Progress
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
