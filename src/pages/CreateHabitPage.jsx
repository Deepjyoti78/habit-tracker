import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Palette, Bell, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CreateHabitPage.css';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

export default function CreateHabitPage() {
  const { dispatch } = useApp();
  const [showColors, setShowColors] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState('#8b5cf6');
  const [activeDays, setActiveDays] = React.useState([0, 1, 2, 3, 4]); // M-F active by default

  return (
    <motion.div 
      className="create-habit-page-container"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <header className="create-habit-header">
        <button className="back-btn-minimal" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'add-habit' })}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="create-habit-title">create personal habit</h1>
        <button className="header-create-btn-highlight" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}>
          create
        </button>
      </header>

      <div className="habit-initial-settings">
        <div className="setting-pill">
          <span className="pill-emoji">😎</span>
          <span className="pill-label">icon</span>
        </div>
        <div 
          className={`setting-pill ${showColors ? 'active' : ''}`} 
          onClick={() => setShowColors(!showColors)}
        >
          <div className="color-dot" style={{ backgroundColor: selectedColor }}></div>
          <span className="pill-label">colour</span>
        </div>
      </div>

      {showColors && (
        <div className="color-selector-row">
          {colors.map(c => (
            <div 
              key={c} 
              className={`color-option ${selectedColor === c ? 'active' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setSelectedColor(c)}
            >
              {selectedColor === c && <Check size={10} color="#fff" />}
            </div>
          ))}
        </div>
      )}

      <div className="habit-inputs-container">
        <input type="text" className="habit-name-input" placeholder="habit name..." />
        <textarea 
          className="habit-details-input" 
          placeholder="extra details..."
          rows="3"
        ></textarea>
      </div>

      <div className="habit-settings-list">
        <div className="setting-item-row">
          <span className="setting-item-label">frequency</span>
          <div className="setting-item-value">
            <span>every day</span>
            <ChevronRight size={16} />
          </div>
        </div>
        
        <div className="setting-item-row">
          <span className="setting-item-label">repeats</span>
          <div className="setting-item-value">
            <span>1 time per day</span>
            <ChevronRight size={16} />
          </div>
        </div>

        <div className="setting-item-row">
          <span className="setting-item-label">reminders</span>
          <div className="setting-item-value">
            <span>on</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>

      <div className="active-days-section">
        <div className="active-days-label">
          <span>active</span>
          <span>days</span>
        </div>
        <div className="days-row">
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={`day-circle ${activeDays.includes(idx) ? 'active' : ''} ${idx >= 5 ? 'weekend' : ''}`}
              onClick={() => {
                if (activeDays.includes(idx)) {
                  setActiveDays(activeDays.filter(d => d !== idx));
                } else {
                  setActiveDays([...activeDays, idx]);
                }
              }}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
