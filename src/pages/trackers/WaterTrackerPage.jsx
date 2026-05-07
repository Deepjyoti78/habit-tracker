import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Droplets, ChevronDown } from 'lucide-react';

export default function WaterTrackerPage({ habit }) {
    const total = habit.targetValue || 8;
    const [filled, setFilled] = useState(habit.currentValue || 4);
    const [remind, setRemind] = useState(true);
    const pct = Math.round((filled / total) * 100);

    return (
        <motion.div className="ht-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            <motion.div className="ht-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <div className="ht-water-hero">
                    <div>
                        <h2 className="ht-water-big">
                            {filled} <span className="ht-water-of">of {total}</span>
                        </h2>
                        <p className="ht-water-sub">
                            {filled >= total ? '🎉 goal reached!' : `${total - filled} more glasses to go`}
                        </p>
                    </div>
                    <div className="ht-mini-ring">
                        <svg width="72" height="72" viewBox="0 0 72 72">
                            <circle
                                cx="36"
                                cy="36"
                                r="28"
                                fill="none"
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth="6"
                            />
                            <motion.circle
                                cx="36"
                                cy="36"
                                r="28"
                                fill="none"
                                stroke={habit.color}
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={String(2 * Math.PI * 28)}
                                initial={{ strokeDashoffset: String(2 * Math.PI * 28) }}
                                animate={{ strokeDashoffset: String(2 * Math.PI * 28 * (1 - pct / 100)) }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                transform="rotate(-90 36 36)"
                                style={{ filter: `drop-shadow(0 0 6px ${habit.color}88)` }}
                            />
                        </svg>
                        <div className="ht-mini-ring-val">{pct}%</div>
                    </div>
                </div>
                <div className="ht-progress-track">
                    <motion.div
                        className="ht-progress-fill"
                        style={{ background: habit.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
            </motion.div>

            <motion.div className="ht-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <p className="ht-card-label">tap glasses to log</p>
                <div className="ht-glass-grid">
                    {Array.from({ length: total }).map((_, i) => (
                        <motion.button
                            key={i}
                            className={`ht-glass ${i < filled ? 'filled' : ''}`}
                            style={{ '--c': habit.color }}
                            onClick={() => setFilled(i < filled ? i : i + 1)}
                            whileTap={{ scale: 0.85 }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.12 + i * 0.04, type: 'spring', stiffness: 300 }}
                        >
                            <Droplets size={18} />
                        </motion.button>
                    ))}
                </div>
                <div className="ht-log-controls">
                    <motion.button
                        className="ht-log-btn"
                        onClick={() => setFilled(f => Math.max(0, f - 1))}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Minus size={16} />
                    </motion.button>
                    <span className="ht-log-label">log a glass</span>
                    <motion.button
                        className="ht-log-btn plus"
                        style={{ background: habit.color, color: '#000', border: 'none' }}
                        onClick={() => setFilled(f => Math.min(total, f + 1))}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Plus size={16} />
                    </motion.button>
                </div>
            </motion.div>

            <motion.div className="ht-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div className="ht-notif-row">
                    <div>
                        <p className="ht-card-title">notification</p>
                        <p className="ht-card-sub">remind me to drink water</p>
                    </div>
                    <motion.div
                        className={`ht-toggle ${remind ? 'on' : ''}`}
                        style={remind ? { background: habit.color } : {}}
                        onClick={() => setRemind(r => !r)}
                    >
                        <motion.div
                            className="ht-toggle-knob"
                            animate={{ x: remind ? 20 : 2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                    </motion.div>
                </div>
                <div className="ht-freq-pill">
                    <span>every 45 minutes</span>
                    <ChevronDown size={13} />
                </div>
            </motion.div>

            <motion.div className="ht-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="ht-card-header">
                    <p className="ht-card-title">weekly summary</p>
                    <div className="ht-period-chip">this week <ChevronDown size={11} /></div>
                </div>
                <div className="ht-bar-chart">
                    {[3, 5, 2, 7, 4, 6, filled].map((v, i) => {
                        const max = Math.max(3, 5, 2, 7, 4, 6, filled, 1);
                        const isToday = i === 6;
                        return (
                            <div key={i} className="ht-bar-col">
                                <div className="ht-bar-track">
                                    <motion.div
                                        className="ht-bar-fill"
                                        style={{ background: isToday ? habit.color : 'rgba(255,255,255,0.07)' }}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(v / max) * 100}%` }}
                                        transition={{ duration: 0.6, delay: 0.25 + i * 0.05, ease: 'easeOut' }}
                                    />
                                </div>
                                <span className="ht-bar-label">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

        </motion.div>
    );
}