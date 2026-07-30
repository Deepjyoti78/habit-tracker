import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Star, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createHabit } from '../api/habits';
import './CreateHabitPage.css';

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#CCFF00'];
const frequencyOptions = ['every day', '3 times / week', 'on weekends', 'custom'];

export default function CreateHabitPage() {
  const { dispatch } = useApp();
  const [showColors, setShowColors] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState('#8b5cf6');
  const [activeDays, setActiveDays] = React.useState([0, 1, 2, 3, 4]);
  const [habitName, setHabitName] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [frequency, setFrequency] = React.useState('every day');
  const [showFreqDropdown, setShowFreqDropdown] = React.useState(false);
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

  const toggleDay = (idx) => {
    setActiveDays(prev =>
      prev.includes(idx) ? prev.filter(d => d !== idx) : [...prev, idx]
    );
  };

  return (
    <motion.div
      className="chp-page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="chp-header">
        <button
          className="chp-back"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="chp-header-label">create new habit</h1>
        <button
          className={`chp-create-btn ${!habitName.trim() ? 'disabled' : ''}`}
          onClick={handleCreate}
          disabled={saving || !habitName.trim()}
        >
          {saving ? <span className="chp-spinner" /> : 'create'}
        </button>
      </header>

      {/* Name input */}
      <div className="chp-name-section">
        <div className="chp-color-preview" style={{ backgroundColor: selectedColor }} />
        <input
          className="chp-name-input"
          placeholder="habit name..."
          value={habitName}
          onChange={e => setHabitName(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      {/* Details */}
      <textarea
        className="chp-details-input"
        placeholder="add a note or description..."
        rows="2"
        value={details}
        onChange={e => setDetails(e.target.value)}
      />

      {/* Tags row */}
      <div className="chp-tags-row">
        <button
          className={`chp-tag ${showColors ? 'active' : ''}`}
          onClick={() => setShowColors(!showColors)}
        >
          <div className="chp-tag-color-dot" style={{ backgroundColor: selectedColor }} />
          colour
        </button>

        <button
          className={`chp-tag ${isCore ? 'active core' : ''}`}
          onClick={() => setIsCore(!isCore)}
        >
          <Star
            size={11}
            color={isCore ? '#000' : '#CCFF00'}
            fill={isCore ? '#000' : 'none'}
          />
          core discipline
        </button>

        <button
          className={`chp-tag ${reminder ? 'active' : ''}`}
          onClick={() => setReminder(r => !r)}
        >
          {reminder ? '🔔' : '🔕'}
          reminder {reminder ? 'on' : 'off'}
        </button>
      </div>

      {/* Color palette */}
      <AnimatePresence>
        {showColors && (
          <motion.div
            className="chp-colors"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {colors.map(c => (
              <div
                key={c}
                className={`chp-color-dot ${selectedColor === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => { setSelectedColor(c); setShowColors(false); }}
              >
                {selectedColor === c && <Check size={10} color="#000" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings card */}
      <div className="chp-settings-card">

        {/* Frequency row */}
        <div
          className="chp-setting-row"
          onClick={() => setShowFreqDropdown(!showFreqDropdown)}
        >
          <div className="chp-setting-left">
            <span className="chp-setting-icon">⏱</span>
            <span className="chp-setting-label">frequency</span>
          </div>
          <div className="chp-freq-value">
            <span>{frequency}</span>
            <motion.span
              className="chp-freq-chevron"
              animate={{ rotate: showFreqDropdown ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▾
            </motion.span>
          </div>
        </div>

        {/* Frequency dropdown */}
        <AnimatePresence>
          {showFreqDropdown && (
            <motion.div
              className="chp-freq-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {frequencyOptions.map(o => (
                <div
                  key={o}
                  className={`chp-freq-option ${frequency === o ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFrequency(o);
                    setShowFreqDropdown(false);
                  }}
                >
                  <span>{o}</span>
                  {frequency === o && <Check size={13} color="#CCFF00" />}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="chp-divider" />

        {/* Repeats row */}
        <div className="chp-setting-row">
          <div className="chp-setting-left">
            <span className="chp-setting-icon">🔁</span>
            <span className="chp-setting-label">repeats / day</span>
          </div>
          <div className="chp-counter">
            <button
              className="chp-counter-btn"
              onClick={() => setRepeats(r => Math.max(1, r - 1))}
              disabled={repeats <= 1}
            >−</button>
            <span className="chp-counter-val">{repeats}</span>
            <button
              className="chp-counter-btn"
              onClick={() => setRepeats(r => r + 1)}
            >+</button>
          </div>
        </div>
      </div>

      {/* Active days */}
      <div className="chp-days-card">
        <p className="chp-days-label">active days</p>
        <div className="chp-days-row">
          {days.map((day, idx) => (
            <button
              key={idx}
              className={`chp-day ${activeDays.includes(idx) ? 'active' : ''} ${idx >= 5 ? 'weekend' : ''}`}
              onClick={() => toggleDay(idx)}
              style={activeDays.includes(idx) ? {
                borderColor: selectedColor,
                color: selectedColor,
                backgroundColor: `${selectedColor}18`
              } : {}}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.button
        className={`chp-bottom-btn ${!habitName.trim() ? 'disabled' : ''}`}
        onClick={handleCreate}
        disabled={saving || !habitName.trim()}
        whileTap={{ scale: 0.98 }}
      >
        {saving ? (
          <span className="chp-spinner" />
        ) : (
          <>
            <Zap size={16} fill="#000" />
            start tracking
          </>
        )}
      </motion.button>
    </motion.div>
  );
}