import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function MindTrackerPage({ habit }) {
    const moods = [
        { emoji: '😩', label: 'very low' },
        { emoji: '😔', label: 'bad' },
        { emoji: '😐', label: 'neutral' },
        { emoji: '🙂', label: 'fine' },
        { emoji: '😄', label: 'awesome' },
    ];
    const [selectedMood, setSelectedMood] = useState(null);

    return (
        <motion.div className="ht-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
                className="ht-mind-promo"
                style={{ borderColor: `${habit.color}22` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <div className="ht-mind-promo-body">
                    <p className="ht-card-title">manage stress</p>
                    <p className="ht-card-sub">
                        regularly practice stress management techniques such as yoga, meditation, or deep breathing.
                    </p>
                    <motion.button
                        className="ht-mind-cta"
                        style={{ background: habit.color, color: '#000' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        start daily meditation
                    </motion.button>
                </div>
                <span className="ht-mind-emoji">🧘‍♀️</span>
            </motion.div>

            <motion.div
                className="ht-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="ht-card-header">
                    <p className="ht-card-title">mood tracker</p>
                    <div className="ht-period-chip">this week <ChevronDown size={11} /></div>
                </div>
                <div className="ht-mood-row">
                    {moods.map((m, i) => (
                        <motion.button
                            key={i}
                            className={`ht-mood-btn ${selectedMood === i ? 'selected' : ''}`}
                            style={
                                selectedMood === i
                                    ? { borderColor: habit.color, background: `${habit.color}18` }
                                    : {}
                            }
                            onClick={() => setSelectedMood(i)}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 + i * 0.05 }}
                        >
                            <span className="ht-mood-emoji">{m.emoji}</span>
                            <span className="ht-mood-label">{m.label}</span>
                        </motion.button>
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
                    <p className="ht-card-title">heart rate data</p>
                    <div className="ht-period-chip">
                        today <span className="ht-live-dot" />
                    </div>
                </div>
                <div className="ht-hr-graph">
                    <svg width="100%" height="70" viewBox="0 0 300 70" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="hrg" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={habit.color} stopOpacity="0.25" />
                                <stop offset="100%" stopColor={habit.color} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <motion.path
                            d="M0 55 Q 40 20 80 45 T 160 35 T 220 20 T 300 45"
                            fill="none"
                            stroke={habit.color}
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                        <path
                            d="M0 55 Q 40 20 80 45 T 160 35 T 220 20 T 300 45 V 70 H 0 Z"
                            fill="url(#hrg)"
                        />
                    </svg>
                </div>
                <div className="ht-hr-stats">
                    {[
                        { val: '75 bpm', label: 'average' },
                        { val: '54 bpm', label: 'minimum' },
                        { val: '123 bpm', label: 'maximum' },
                    ].map((s, i) => (
                        <div key={i} className="ht-hr-stat">
                            <span className="ht-hr-val" style={{ color: i === 0 ? habit.color : '#fff' }}>
                                {s.val}
                            </span>
                            <span className="ht-hr-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div
                className="ht-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="ht-card-header">
                    <p className="ht-card-title">this week</p>
                </div>
                <div className="ht-hr-stats">
                    {[
                        { val: '7d', label: 'streak' },
                        { val: '14', label: 'sessions' },
                        { val: '82%', label: 'avg mood' },
                    ].map((s, i) => (
                        <div key={i} className="ht-hr-stat">
                            <span className="ht-hr-val" style={{ color: i === 0 ? habit.color : '#fff' }}>
                                {s.val}
                            </span>
                            <span className="ht-hr-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
