import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, RotateCcw, Settings, Check, Plus, Minus, Droplets, Moon, Brain, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CalendarStrip from '../components/CalendarStrip';
import './HabitTrackerPage.css';

// ── Water Tracker ──
function WaterTracker({ habit }) {
    const total = habit.targetValue || 8;
    const [filled, setFilled] = useState(habit.currentValue || 4);

    const glasses = Array.from({ length: total });

    return (
        <div className="ht-content">
            <div className="ht-hero-number">
                <span className="ht-big-num">{filled}</span>
                <span className="ht-big-unit">of {total} glasses</span>
            </div>
            <p className="ht-hero-sub">
                {filled >= total
                    ? '🎉 daily goal reached!'
                    : `keep going — only ${total - filled} glasses left for today`}
            </p>

            {/* Glass grid */}
            <div className="ht-water-grid">
                {glasses.map((_, i) => (
                    <motion.div
                        key={i}
                        className={`ht-glass ${i < filled ? 'filled' : ''}`}
                        onClick={() => setFilled(i < filled ? i : i + 1)}
                        whileTap={{ scale: 0.9 }}
                        style={{ '--glass-color': habit.color }}
                    >
                        <Droplets size={20} />
                    </motion.div>
                ))}
            </div>

            {/* Controls */}
            <div className="ht-controls">
                <button className="ht-ctrl-btn minus" onClick={() => setFilled(f => Math.max(0, f - 1))}>
                    <Minus size={18} />
                </button>
                <div className="ht-ctrl-center">
                    <span className="ht-ctrl-label">log a glass</span>
                </div>
                <button
                    className="ht-ctrl-btn plus"
                    style={{ backgroundColor: habit.color }}
                    onClick={() => setFilled(f => Math.min(total, f + 1))}
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Summary */}
            <div className="ht-summary-card">
                <h3 className="ht-summary-title">today's summary</h3>
                <div className="ht-summary-stats">
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val" style={{ color: habit.color }}>{filled}</span>
                        <span className="ht-summary-label">consumed</span>
                    </div>
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val">{total - filled}</span>
                        <span className="ht-summary-label">remaining</span>
                    </div>
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val">{Math.round((filled / total) * 100)}%</span>
                        <span className="ht-summary-label">progress</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="ht-progress-track">
                    <motion.div
                        className="ht-progress-fill"
                        style={{ backgroundColor: habit.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(filled / total) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>
        </div>
    );
}

// ── Sleep Tracker ──
function SleepTracker({ habit }) {
    const [quality, setQuality] = useState(82);
    const [sleepTime, setSleepTime] = useState('11:30 PM');
    const [wakeTime, setWakeTime] = useState('07:00 AM');
    const [duration, setDuration] = useState('7:30 H');

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (circumference * quality) / 100;

    return (
        <div className="ht-content">
            {/* Quality ring */}
            <div className="ht-sleep-ring-wrap">
                <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <motion.circle
                        cx="80" cy="80" r="54" fill="none"
                        stroke={habit.color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        transform="rotate(-90 80 80)"
                    />
                </svg>
                <div className="ht-sleep-ring-center">
                    <span className="ht-sleep-quality-label">sleep quality</span>
                    <span className="ht-sleep-quality-val">{quality}%</span>
                    <span className="ht-sleep-quality-sub">you sleep better today ✓</span>
                </div>
            </div>

            {/* Times row */}
            <div className="ht-sleep-times">
                <div className="ht-sleep-time-item">
                    <span className="ht-sleep-time-label">fall asleep</span>
                    <span className="ht-sleep-time-val">{sleepTime}</span>
                </div>
                <div className="ht-sleep-time-divider" />
                <div className="ht-sleep-time-item">
                    <span className="ht-sleep-time-label">wake up</span>
                    <span className="ht-sleep-time-val">{wakeTime}</span>
                </div>
                <div className="ht-sleep-time-divider" />
                <div className="ht-sleep-time-item">
                    <span className="ht-sleep-time-label">duration</span>
                    <span className="ht-sleep-time-val">{duration}</span>
                </div>
            </div>

            {/* Quality slider */}
            <div className="ht-summary-card">
                <h3 className="ht-summary-title">adjust sleep quality</h3>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={quality}
                    onChange={e => setQuality(Number(e.target.value))}
                    className="ht-sleep-slider"
                    style={{ '--slider-color': habit.color }}
                />
                <div className="ht-summary-stats">
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val" style={{ color: habit.color }}>{quality}%</span>
                        <span className="ht-summary-label">quality</span>
                    </div>
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val">{duration}</span>
                        <span className="ht-summary-label">duration</span>
                    </div>
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val">{habit.streak || 0}d</span>
                        <span className="ht-summary-label">streak</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Study / Academic / Coding / Communication Tracker ──
function StudyTracker({ habit }) {
    const total = habit.targetValue || 6;
    const [current, setCurrent] = useState(habit.currentValue || 2);
    const [todos, setTodos] = useState([
        { id: 1, text: 'complete daily goal', done: false },
        { id: 2, text: 'review yesterday\'s notes', done: true },
        { id: 3, text: 'practice for 30 mins', done: false },
    ]);
    const [newTodo, setNewTodo] = useState('');

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (circumference * (current / total));

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const addTodo = () => {
        if (!newTodo.trim()) return;
        setTodos([...todos, { id: Date.now(), text: newTodo, done: false }]);
        setNewTodo('');
    };

    return (
        <div className="ht-content">
            {/* Ring */}
            <div className="ht-sleep-ring-wrap">
                <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <motion.circle
                        cx="80" cy="80" r="54" fill="none"
                        stroke={habit.color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        transform="rotate(-90 80 80)"
                    />
                </svg>
                <div className="ht-sleep-ring-center">
                    <span className="ht-sleep-quality-label">session</span>
                    <span className="ht-sleep-quality-val">{current}/{total}</span>
                    <span className="ht-sleep-quality-sub">
                        {current >= total ? 'goal reached! ✓' : `${total - current} left`}
                    </span>
                </div>
            </div>

            {/* Session controls */}
            <div className="ht-controls">
                <button className="ht-ctrl-btn minus" onClick={() => setCurrent(c => Math.max(0, c - 1))}>
                    <Minus size={18} />
                </button>
                <div className="ht-ctrl-center">
                    <span className="ht-ctrl-label">log session</span>
                </div>
                <button
                    className="ht-ctrl-btn plus"
                    style={{ backgroundColor: habit.color }}
                    onClick={() => setCurrent(c => Math.min(total, c + 1))}
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* To-do list */}
            <div className="ht-summary-card">
                <div className="ht-todo-header">
                    <h3 className="ht-summary-title">to-do</h3>
                    <div className="ht-todo-add">
                        <input
                            className="ht-todo-input"
                            placeholder="add task..."
                            value={newTodo}
                            onChange={e => setNewTodo(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTodo()}
                        />
                        <button className="ht-todo-add-btn" style={{ backgroundColor: habit.color }} onClick={addTodo}>
                            <Plus size={12} />
                        </button>
                    </div>
                </div>
                {todos.map(todo => (
                    <div key={todo.id} className={`ht-todo-item ${todo.done ? 'done' : ''}`} onClick={() => toggleTodo(todo.id)}>
                        <div className="ht-todo-check" style={{ borderColor: todo.done ? habit.color : '#333', backgroundColor: todo.done ? habit.color : 'transparent' }}>
                            {todo.done && <Check size={10} color="#000" />}
                        </div>
                        <span className="ht-todo-text">{todo.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Mind Tracker ──
function MindTracker({ habit }) {
    const [moodData] = useState([80, 20, 30, 10, 50, 40, 65]);
    const [selectedMood, setSelectedMood] = useState(null);
    const moods = ['😩', '😔', '😐', '🙂', '😄'];
    const moodLabels = ['very low', 'bad', 'neutral', 'fine', 'awesome'];

    return (
        <div className="ht-content">
            {/* Manage stress card */}
            <div className="ht-mind-card">
                <div className="ht-mind-card-text">
                    <h3 className="ht-mind-card-title">manage stress</h3>
                    <p className="ht-mind-card-sub">
                        regularly practice stress management techniques such as yoga, meditation, or deep breathing exercises.
                    </p>
                    <button className="ht-mind-cta" style={{ backgroundColor: habit.color, color: '#000' }}>
                        start daily meditation
                    </button>
                </div>
                <div className="ht-mind-card-emoji">🧘</div>
            </div>

            {/* Mood tracker */}
            <div className="ht-summary-card">
                <div className="ht-mood-header">
                    <h3 className="ht-summary-title">mood tracker</h3>
                    <span className="ht-mood-period">this week</span>
                </div>
                <div className="ht-mood-row">
                    {moods.map((emoji, i) => (
                        <button
                            key={i}
                            className={`ht-mood-btn ${selectedMood === i ? 'selected' : ''}`}
                            style={selectedMood === i ? { borderColor: habit.color } : {}}
                            onClick={() => setSelectedMood(i)}
                        >
                            <span className="ht-mood-emoji">{emoji}</span>
                            <span className="ht-mood-label">{moodLabels[i]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="ht-summary-card">
                <h3 className="ht-summary-title">this week</h3>
                <div className="ht-summary-stats">
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val" style={{ color: habit.color }}>{habit.streak || 0}d</span>
                        <span className="ht-summary-label">streak</span>
                    </div>
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val">12</span>
                        <span className="ht-summary-label">sessions</span>
                    </div>
                    <div className="ht-summary-stat">
                        <span className="ht-summary-val">85%</span>
                        <span className="ht-summary-label">avg mood</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ──
export default function HabitTrackerPage() {
    const { state, dispatch } = useApp();
    const { selectedHabitId } = state;
    const [selectedDate, setSelectedDate] = useState(new Date());

    const habit = state.habits.find(h => h.id === selectedHabitId) || state.habits[0];

    if (!habit) {
        dispatch({ type: 'SET_PAGE', payload: 'habits' });
        return null;
    }

    const renderTracker = () => {
        switch (habit.trackingType) {
            case 'water': return <WaterTracker habit={habit} />;
            case 'sleep': return <SleepTracker habit={habit} />;
            case 'mind': return <MindTracker habit={habit} />;
            case 'study':
            default: return <StudyTracker habit={habit} />;
        }
    };

    return (
        <motion.div
            className="ht-page"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <header className="ht-header">
                <button className="ht-back-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}>
                    <ChevronLeft size={20} />
                </button>
                <h1 className="ht-title">{habit.name.toLowerCase()} tracking</h1>
                <div style={{ width: 36 }} />
            </header>

            {/* Calendar */}
            <div className="ht-calendar-wrap">
                <CalendarStrip
                    hideHeader={true}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                />
            </div>

            {/* Tracker content */}
            {renderTracker()}
        </motion.div>
    );
}