import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createHabit } from '../api/habits';
import './CreateHabitPage.css';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
const frequencyOptions = ['every day', '3 times / week', 'on weekends', 'custom'];

export default function CreateHabitPage() {
  const { dispatch } = useApp();
  const [showColors, setShowColors] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState('#8b5cf6');
  const [activeDays, setActiveDays] = React.useState([0, 1, 2, 3, 4]);
  const [habitName, setHabitName] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [frequency, setFrequency] = React.useState('every day');
  const [repeats, setRepeats] = React.useState(1);
  const [reminder, setReminder] = React.useState(true);
  const [isCore, setIsCore] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const handleCreate = async () => {
    if (!habitName.trim()) return;
    setSaving(true);
    try {
      const res = await createHabit({
        name: habitName,
        emoji: '🎯',
        category: 'custom',
        color: selectedColor,
        target_value: repeats,
        unit: 'times',
        frequency,
        active_days: activeDays,
        reminder,
        is_core: isCore,
      });
      dispatch({ type: 'ADD_HABIT', payload: res.data });
      dispatch({ type: 'SET_PAGE', payload: 'habits' });
    } catch (err) {
      console.error('Failed to create habit:', err);
    } finally {
      setSaving(false);
    }
  };

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
        <button className="header-create-btn-highlight" onClick={handleCreate} disabled={saving}>
          {saving ? '...' : 'create'}
        </button>
      </header>

      <div className="habit-initial-settings">
        <div className={`setting-pill ${showColors ? 'active' : ''}`} onClick={() => setShowColors(!showColors)}>
          <div className="color-dot" style={{ backgroundColor: selectedColor }} />
          <span className="pill-label">colour</span>
        </div>
        {/* Core Discipline pill */}
        <div className={`setting-pill ${isCore ? 'active' : ''}`} onClick={() => setIsCore(!isCore)}>
          <Star size={13} color={isCore ? '#000' : '#CCFF00'} fill={isCore ? '#000' : 'none'} />
          <span className="pill-label">core discipline</span>
        </div>
      </div>

      {showColors && (
        <div className="color-selector-row">
          {colors.map(c => (
            <div key={c} className={`color-option ${selectedColor === c ? 'active' : ''}`}
              style={{ backgroundColor: c }} onClick={() => setSelectedColor(c)}>
              {selectedColor === c && <Check size={10} color="#fff" />}
            </div>
          ))}
        </div>
      )}

      <div className="habit-inputs-container">
        <input
          type="text"
          className="habit-name-input"
          placeholder="habit name..."
          value={habitName}
          onChange={e => setHabitName(e.target.value)}
        />
        <textarea
          className="habit-details-input"
          placeholder="extra details..."
          rows="3"
          value={details}
          onChange={e => setDetails(e.target.value)}
        />
      </div>

      <div className="habit-settings-list">
        <div className="setting-item-row">
          <span className="setting-item-label">frequency</span>
          <select
            className="setting-select"
            value={frequency}
            onChange={e => setFrequency(e.target.value)}
          >
            {frequencyOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div className="setting-item-row">
          <span className="setting-item-label">repeats per day</span>
          <div className="setting-item-value">
            <button className="counter-btn" onClick={() => setRepeats(r => Math.max(1, r - 1))}>−</button>
            <span style={{ color: '#CCFF00', minWidth: '20px', textAlign: 'center' }}>{repeats}</span>
            <button className="counter-btn" onClick={() => setRepeats(r => r + 1)}>+</button>
          </div>
        </div>

        <div className="setting-item-row" onClick={() => setReminder(r => !r)} style={{ cursor: 'pointer' }}>
          <span className="setting-item-label">reminders</span>
          <div className="setting-item-value">
            <span style={{ color: reminder ? '#CCFF00' : '#555' }}>{reminder ? 'on' : 'off'}</span>
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
              onClick={() => setActiveDays(activeDays.includes(idx) ? activeDays.filter(d => d !== idx) : [...activeDays, idx])}
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}