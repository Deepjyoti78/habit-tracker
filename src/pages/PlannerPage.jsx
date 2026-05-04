import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Clock, Calendar, MoreHorizontal, Plus, ChevronLeft, MessageSquare, Flag, Briefcase, ChevronRight } from 'lucide-react';
import './PlannerPage.css';

// --- Custom Components ---

function CustomSelect({ value, onChange, options }) {
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
      <div className="custom-select-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedOption ? `${selectedOption.icon} ${selectedOption.label}` : 'Select type'}</span>
        <ChevronDown size={16} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="custom-select-options"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
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
  const rotation = mode === 'hour'
    ? (hour % 12) * 30
    : (minute / 5) * 30;

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
            initial={{ rotate: rotation, height: mode === 'hour' ? '70px' : '90px' }}
            animate={{ 
              rotate: rotation, 
              height: mode === 'hour' ? '70px' : '90px' 
            }}
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

  // Padding
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day outside" />);
  }

  // Days
  for (let d = 1; d <= totalDays; d++) {
    const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
    const isSelected = selectedDate.toDateString() === new Date(year, month, d).toDateString();

    days.push(
      <div
        key={d}
        className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
        onClick={() => {
          const newDate = new Date(year, month, d);
          // Store as YYYY-MM-DD string to avoid timezone shifts
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
  const [groups, setGroups] = useState(tasksData);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('High');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('10:00 AM');
  const [workType, setWorkType] = useState('Deep Work');
  const [dueDate, setDueDate] = useState('2026-05-04');

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
    };

    setGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const targetGroupIndex = 0;
      newGroups[targetGroupIndex] = {
        ...newGroups[targetGroupIndex],
        tasks: [newTask, ...newGroups[targetGroupIndex].tasks]
      };
      return newGroups;
    });

    setTitle('');
    setDescription('');
    setPriority('High');
    setStartTime('09:00 AM');
    setEndTime('10:00 AM');
    setWorkType('Deep Work');
    setDueDate('2026-05-04');
    setModalOpen(false);
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
        <div className="tasks-page-header">
          <h1 className="tasks-page-title">all tasks</h1>
          <button className="tasks-more-btn">
            <MoreHorizontal size={18} />
          </button>
        </div>

        <div className="tasks-groups">
          {groups.map((group) => (
            <TaskGroup key={group.group} group={group.group} tasks={group.tasks} />
          ))}
        </div>
      </motion.div>

      {/* FAB */}
      <motion.button
        className="planner-fab"
        whileTap={{ scale: 0.9 }}
        onClick={() => setModalOpen(true)}
      >
        <Plus size={24} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="task-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
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
                <button className="task-modal-back" onClick={() => setModalOpen(false)}>
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
                  <div className="task-priority-selector">
                    <button
                      className={`task-priority-btn high ${priority === 'High' ? 'active' : ''}`}
                      onClick={() => setPriority('High')}
                    >High</button>
                    <button
                      className={`task-priority-btn medium ${priority === 'Medium' ? 'active' : ''}`}
                      onClick={() => setPriority('Medium')}
                    >Medium</button>
                    <button
                      className={`task-priority-btn low ${priority === 'Low' ? 'active' : ''}`}
                      onClick={() => setPriority('Low')}
                    >Low</button>
                  </div>
                </div>

                <div className="task-modal-field">
                  <div className="task-modal-icon"><Clock size={16} /></div>
                  <span className="task-modal-label">Time</span>
                  <div className="task-time-inputs">
                    <div className="custom-select-trigger" onClick={() => setActivePicker('start')}>
                      {startTime || '--:--'}
                    </div>
                    <span className="time-separator">to</span>
                    <div className="custom-select-trigger" onClick={() => setActivePicker('end')}>
                      {endTime || '--:--'}
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
                  />
                </div>

                <div className="task-modal-field">
                  <div className="task-modal-icon"><Calendar size={16} /></div>
                  <span className="task-modal-label">Due date</span>
                  <div className="custom-select-trigger" onClick={() => setActivePicker('date')}>
                    {dueDate || 'Select date'}
                  </div>
                </div>
              </div>

              <div style={{ height: "40px" }} />
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
        )}
      </AnimatePresence>
    </>
  );
}
