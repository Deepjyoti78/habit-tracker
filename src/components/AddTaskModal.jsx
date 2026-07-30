import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Calendar, MessageSquare, Flag, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AddTaskModal.css';

// --- Internal Helper Components ---

function CustomSelect({ value, onChange, options, placeholder = 'Select', openUp = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="custom-select-container" ref={containerRef}>
      <div className={`custom-select-trigger ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="trigger-value">
          {selectedOption ? (
            <>
              <span className="opt-icon">{selectedOption.icon}</span>
              <span className="opt-label">{selectedOption.label}</span>
            </>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={14} className={`chevron ${isOpen ? 'rotate' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`custom-select-options ${openUp ? 'open-up' : ''}`}
            initial={{ opacity: 0, y: openUp ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openUp ? -10 : 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`custom-select-option ${value === opt.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <span className="opt-icon">{opt.icon}</span>
                <span className="opt-label">{opt.label}</span>
                {value === opt.value && <div className="selected-dot" />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClockPicker({ value, onChange, onClose }) {
  const [hour, setHour] = useState(10);
  const [minute, setMinute] = useState(30);
  const [ampm, setAmpm] = useState('AM');
  const [mode, setMode] = useState('hour'); 

  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const currentSelection = mode === 'hour' ? hour : minute;
  const rotation = mode === 'hour' ? (hour % 12) * 30 : (minute / 5) * 30;

  return (
    <div className="clock-picker-overlay" onClick={onClose}>
      <motion.div
        className="clock-picker-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="clock-display">
          <div className="clock-display-time">
            <span className={mode === 'hour' ? 'active' : ''} onClick={() => setMode('hour')}>
              {hour}
            </span>
            <span className="time-divider">:</span>
            <span className={mode === 'minute' ? 'active' : ''} onClick={() => setMode('minute')}>
              {minute.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="clock-display-ampm">
            <div className={`ampm-side-btn ${ampm === 'AM' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setAmpm('AM'); }}>AM</div>
            <div className={`ampm-side-btn ${ampm === 'PM' ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setAmpm('PM'); }}>PM</div>
          </div>
        </div>

        <div className="clock-face">
          <div className="clock-center" />
          <motion.div
            className="clock-hand"
            initial={{ rotate: rotation, height: mode === 'hour' ? '85px' : '95px' }}
            animate={{ rotate: rotation, height: mode === 'hour' ? '85px' : '95px' }}
            transition={{ type: "spring", damping: 20, stiffness: 400, mass: 0.8 }}
          />

          {(mode === 'hour' ? numbers : minutes).map((num, i) => {
            const angle = (i * 30) * (Math.PI / 180) - (Math.PI / 2);
            const radius = 95; 
            const x = 120 + radius * Math.cos(angle);
            const y = 120 + radius * Math.sin(angle);

            return (
              <div
                key={mode + num}
                className={`clock-number ${currentSelection === num ? 'active' : ''}`}
                style={{ left: x - 17, top: y - 17 }}
                onClick={() => {
                  if (mode === 'hour') {
                    setHour(num);
                    setMode('minute');
                  } else {
                    setMinute(num);
                    const formattedMinute = num.toString().padStart(2, '0');
                    setTimeout(() => {
                      onChange(`${hour}:${formattedMinute} ${ampm}`);
                      onClose();
                    }, 200);
                  }
                }}
              >
                {num}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function CustomDatePicker({ value, onChange, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const selectedDate = value ? new Date(value) : new Date();

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day outside" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
    const isSelected = selectedDate.toDateString() === new Date(year, month, d).toDateString();

    days.push(
      <div
        key={d}
        className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={() => {
          const newDate = new Date(year, month, d);
          const yearStr = newDate.getFullYear();
          const monthStr = (newDate.getMonth() + 1).toString().padStart(2, '0');
          const dayStr = newDate.getDate().toString().padStart(2, '0');
          onChange(`${yearStr}-${monthStr}-${dayStr}`);
        }}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="date-picker-overlay" onClick={onClose}>
      <motion.div
        className="date-picker-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="calendar-header">
          <span className="calendar-month-year">{monthName} {year}</span>
          <div className="calendar-nav">
            <button className="calendar-nav-btn" onClick={prevMonth}><ChevronLeft size={16} /></button>
            <button className="calendar-nav-btn" onClick={nextMonth}><ChevronRight size={16} /></button>
          </div>
        </div>

        <div className="calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="calendar-weekday">{d}</div>
          ))}
          {days}
        </div>

        <div className="picker-footer">
          <button className="picker-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="picker-btn-confirm" onClick={onClose}>Confirm</button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Modal Component ---

export default function AddTaskModal() {
  const { dispatch } = useApp();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  const [workType, setWorkType] = useState('Deep Work');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Picker States
  const [activePicker, setActivePicker] = useState(null); // 'start', 'end', 'date'

  const handleAddTask = () => {
    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      priority,
      label: workType,
      title,
      time: `${startTime} - ${endTime}`,
      due: dueDate,
      color: priority === 'High' ? '#c4fb31' : priority === 'Medium' ? '#f59e0b' : '#6c63ff',
      completed: false
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    dispatch({ type: 'SET_ADD_TASK_MODAL', payload: false });
  };

  const workTypeOptions = [
    { value: 'File Submission', label: 'File Submission', icon: '📁' },
    { value: 'Meeting', label: 'Meeting', icon: '👥' },
    { value: 'Deep Work', label: 'Deep Work', icon: '🎧' },
    { value: 'Review', label: 'Review', icon: '👀' },
  ];

  return (
    <motion.div
      className="task-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => dispatch({ type: 'SET_ADD_TASK_MODAL', payload: false })}
    >
      <motion.div
        className="task-modal-content"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="task-modal-header">
          <button className="task-modal-back" onClick={() => dispatch({ type: 'SET_ADD_TASK_MODAL', payload: false })}>
            <ChevronLeft size={20} />
          </button>
          <button className="task-modal-done" onClick={handleAddTask}>
            Done
          </button>
        </div>

        <input
          type="text"
          className="task-modal-input"
          placeholder="Task title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />

        <div className="task-modal-fields">
          <div className="task-modal-field">
            <div className="task-modal-icon"><MessageSquare size={16} /></div>
            <span className="task-modal-label">Description</span>
            <input
              type="text"
              className="task-modal-value-input"
              placeholder="Add description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="task-modal-field">
            <div className="task-modal-icon"><Flag size={16} /></div>
            <span className="task-modal-label">Priority level</span>
            <CustomSelect
              value={priority}
              onChange={setPriority}
              options={[
                { value: 'High', label: 'High Priority', icon: '🔴' },
                { value: 'Medium', label: 'Medium Priority', icon: '🟡' },
                { value: 'Low', label: 'Low Priority', icon: '🔵' },
              ]}
            />
          </div>

          <div className="task-modal-field">
            <div className="task-modal-icon"><Clock size={16} /></div>
            <span className="task-modal-label">Time</span>
            <div className="task-time-row">
              <div className="time-picker-trigger" onClick={() => setActivePicker('start')}>
                {startTime || '00:00 AM'}
              </div>
              <span className="time-sep">to</span>
              <div className="time-picker-trigger" onClick={() => setActivePicker('end')}>
                {endTime || '00:00 AM'}
              </div>
            </div>
          </div>

          <div className="task-modal-field">
            <div className="task-modal-icon"><Briefcase size={16} /></div>
            <span className="task-modal-label">Work type</span>
            <CustomSelect
              value={workType}
              onChange={setWorkType}
              options={workTypeOptions}
              openUp={true}
            />
          </div>

          <div className="task-modal-field">
            <div className="task-modal-icon"><Calendar size={16} /></div>
            <span className="task-modal-label">Due date</span>
            <div className="date-picker-trigger" onClick={() => setActivePicker('date')}>
              {dueDate || 'Select date'}
            </div>
          </div>
        </div>

      </motion.div>

      {/* Pickers */}
      <AnimatePresence>
        {activePicker === 'start' && (
          <ClockPicker
            value={startTime}
            onChange={setStartTime}
            onClose={() => setActivePicker(null)}
          />
        )}
        {activePicker === 'end' && (
          <ClockPicker
            value={endTime}
            onChange={setEndTime}
            onClose={() => setActivePicker(null)}
          />
        )}
        {activePicker === 'date' && (
          <CustomDatePicker
            value={dueDate}
            onChange={setDueDate}
            onClose={() => setActivePicker(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
