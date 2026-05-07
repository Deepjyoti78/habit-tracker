import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Settings, Check, ChevronDown } from 'lucide-react';

export default function StudyTrackerPage({ habit }) {
    const [current, setCurrent] = useState(2);
    const total = habit.targetValue || 6;
    const [timeLeft, setTimeLeft] = useState(1200);
    const [isActive, setIsActive] = useState(false);
    const [todos, setTodos] = useState([
        { id: 1, text: 'complete dsa practice', done: true },
        { id: 2, text: 'review system design', done: false },
        { id: 3, text: 'project documentation', done: false },
        { id: 4, text: 'apply for internships', done: false },
    ]);

    useEffect(() => {
        let t = null;
        if (isActive && timeLeft > 0) {
            t = setInterval(() => setTimeLeft(s => s - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setCurrent(c => Math.min(total, c + 1));
        }
        return () => clearInterval(t);
    }, [isActive, timeLeft, total]);

    const fmt = s =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const toggleTodo = id =>
        setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));

    return (
        <motion.div className="ht-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
                className="ht-card ht-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <div className="ht-study-ring-wrap">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        <circle
                            cx="100" cy="100" r="75"
                            fill="none"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth="6"
                            strokeDasharray="3 8"
                        />
                        <motion.circle
                            cx="100" cy="100" r="75"
                            fill="none"
                            stroke={habit.color}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 75}
                            animate={{ strokeDashoffset: (2 * Math.PI * 75) - ((timeLeft / 1200) * (2 * Math.PI * 75)) }}
                            transition={{ duration: 0.5, ease: 'linear' }}
                            transform="rotate(-90 100 100)"
                            style={{ filter: `drop-shadow(0 0 12px ${habit.color}88)` }}
                        />
                    </svg>
                    <div className="ht-study-timer-info">
                        <span className="ht-study-session">session {current}/{total}</span>
                        <motion.span
                            className="ht-study-time"
                            animate={isActive ? { scale: [1, 1.01, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            {fmt(timeLeft)}
                        </motion.span>
                        <span className="ht-study-status" style={{ color: habit.color }}>
                            {isActive ? 'stay focused 💪' : 'ready to start?'}
                        </span>
                    </div>
                </div>

                <div className="ht-study-controls">
                    <motion.button
                        className="ht-study-start"
                        style={
                            isActive
                                ? { background: '#ff4444', color: '#fff' }
                                : { background: habit.color, color: '#000' }
                        }
                        onClick={() => setIsActive(a => !a)}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isActive ? 'stop' : 'start'}
                    </motion.button>
                    <div className="ht-study-sec">
                        <button
                            className="ht-study-icon-btn"
                            onClick={() => { setIsActive(false); setTimeLeft(1200); }}
                        >
                            <RefreshCw size={18} />
                        </button>
                        <button className="ht-study-icon-btn">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="ht-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="ht-card-header">
                    <p className="ht-card-title">sessions today</p>
                    <span className="ht-session-count" style={{ color: habit.color }}>
                        {current}/{total}
                    </span>
                </div>
                <div className="ht-session-dots">
                    {Array.from({ length: total }).map((_, i) => (
                        <motion.div
                            key={i}
                            className={`ht-session-dot ${i < current ? 'done' : ''}`}
                            style={
                                i < current
                                    ? { background: habit.color, boxShadow: `0 0 8px ${habit.color}66` }
                                    : {}
                            }
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 300 }}
                        />
                    ))}
                </div>
            </motion.div>

            <motion.div
                className="ht-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <div className="ht-card-header">
                    <p className="ht-card-title">to-do</p>
                    <div className="ht-period-chip">today <ChevronDown size={11} /></div>
                </div>
                <div className="ht-todo-list">
                    {todos.map(todo => (
                        <motion.div
                            key={todo.id}
                            className={`ht-todo-row ${todo.done ? 'done' : ''}`}
                            onClick={() => toggleTodo(todo.id)}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div
                                className="ht-todo-check"
                                style={{
                                    borderColor: todo.done ? habit.color : '#2a2a2a',
                                    background: todo.done ? habit.color : 'transparent',
                                }}
                            >
                                <AnimatePresence>
                                    {todo.done && (
                                        <motion.span
                                            initial={{ scale: 0, rotate: -30 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0 }}
                                        >
                                            <Check size={10} color="#000" strokeWidth={3} />
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                            <span className="ht-todo-text">{todo.text}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}