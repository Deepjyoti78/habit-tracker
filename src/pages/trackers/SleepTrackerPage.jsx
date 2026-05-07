import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function SleepTrackerPage({ habit }) {
    const sleepTime = '12:25';
    const wakeTime = '08:14';
    const duration = '7h 11m';
    const quality = 'Good';

    const R = 100;
    const CX = 110;
    const CY = 110;
    const SIZE = 220;
    const startAngle = 130;
    const endAngle = 410;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const arcPath = (start, end, r) => {
        const s = { x: CX + r * Math.cos(toRad(start)), y: CY + r * Math.sin(toRad(start)) };
        const e = { x: CX + r * Math.cos(toRad(end)), y: CY + r * Math.sin(toRad(end)) };
        const large = end - start > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
    };

    const moonPos = { x: CX + R * Math.cos(toRad(270)), y: CY + R * Math.sin(toRad(270)) };
    const sunPos = { x: CX + R * Math.cos(toRad(90)), y: CY + R * Math.sin(toRad(90)) };

    const weekData = [
        { day: 'S', deep: 55, light: 30 },
        { day: 'M', deep: 40, light: 45 },
        { day: 'T', deep: 60, light: 25 },
        { day: 'W', deep: 70, light: 20 },
        { day: 'T', deep: 35, light: 50 },
        { day: 'F', deep: 65, light: 30 },
        { day: 'S', deep: 50, light: 40 },
    ];

    return (
        <motion.div className="ht-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* ── Quality Badge ── */}
            <motion.div
                className="ht-sleep-quality-badge"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
            >
                <span className="ht-sleep-sparkle">✦</span>
                <div>
                    <p className="ht-sleep-quality-label">sleep quality</p>
                    <h2 className="ht-sleep-quality-val">{quality}</h2>
                </div>
                <span className="ht-sleep-sparkle sm">✦</span>
            </motion.div>

            {/* ── Pills ── */}
            <motion.div
                className="ht-sleep-pills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <div className="ht-sleep-pill">
                    <span className="ht-pill-dot deep" />
                    <div>
                        <p className="ht-pill-label">Deep sleep</p>
                        <p className="ht-pill-val">52min</p>
                    </div>
                </div>
                <div className="ht-sleep-pill">
                    <span className="ht-pill-dot light" />
                    <div>
                        <p className="ht-pill-label">Light sleep</p>
                        <p className="ht-pill-val">6h 19min</p>
                    </div>
                </div>
            </motion.div>

            {/* ── Arc Clock ── */}
            <motion.div
                className="ht-card ht-center ht-sleep-arc-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12, type: 'spring', stiffness: 120 }}
            >
                <div className="ht-sleep-arc-wrap">
                    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                        <defs>
                            <linearGradient id="sleepArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#c084fc" />
                                <stop offset="50%" stopColor="#e879f9" />
                                <stop offset="100%" stopColor="#f0abfc" />
                            </linearGradient>
                            <filter id="sleepGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <motion.path
                            d={arcPath(startAngle, endAngle, R)}
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="14"
                            strokeLinecap="round"
                        />
                        <motion.path
                            d={arcPath(startAngle, endAngle, R)}
                            fill="none"
                            stroke="url(#sleepArcGrad)"
                            strokeWidth="14"
                            strokeLinecap="round"
                            filter="url(#sleepGlow)"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.8, ease: 'easeOut' }}
                        />

                        {/* Moon */}
                        <motion.g
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                            style={{ transformOrigin: `${moonPos.x}px ${moonPos.y}px` }}
                        >
                            <circle cx={moonPos.x} cy={moonPos.y} r="18" fill="#1a1a2e" stroke="#c084fc" strokeWidth="1.5" />
                            <text x={moonPos.x} y={moonPos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="14">🌙</text>
                        </motion.g>
                        <text x={moonPos.x} y={moonPos.y - 26} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="Inter, sans-serif">{sleepTime}</text>

                        {/* Sun */}
                        <motion.g
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                            style={{ transformOrigin: `${sunPos.x}px ${sunPos.y}px` }}
                        >
                            <circle cx={sunPos.x} cy={sunPos.y} r="18" fill="#1a1a2e" stroke="#f0abfc" strokeWidth="1.5" />
                            <text x={sunPos.x} y={sunPos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="14">☀️</text>
                        </motion.g>
                        <text x={sunPos.x} y={sunPos.y + 34} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="Inter, sans-serif">{wakeTime}</text>
                    </svg>

                    <div className="ht-sleep-arc-center">
                        <motion.span
                            className="ht-sleep-duration"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, type: 'spring' }}
                        >
                            {duration}
                        </motion.span>
                        <span className="ht-sleep-of-label">of sleeping</span>
                    </div>
                </div>
            </motion.div>

            {/* ── Bar Chart ── */}
            <motion.div
                className="ht-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="ht-card-header">
                    <p className="ht-card-title">sleep statistics</p>
                    <div className="ht-sleep-tabs">
                        {['Week', 'Month', 'Year'].map((t, i) => (
                            <button key={i} className={`ht-sleep-tab ${i === 0 ? 'active' : ''}`}>{t}</button>
                        ))}
                    </div>
                </div>
                <div className="ht-sleep-bar-chart">
                    {weekData.map((d, i) => (
                        <div key={i} className="ht-sleep-bar-col">
                            <div className="ht-sleep-bar-stack">
                                <motion.div
                                    className="ht-sleep-bar-deep"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${d.deep}%` }}
                                    transition={{ duration: 0.7, delay: 0.25 + i * 0.06, ease: 'easeOut' }}
                                />
                                <motion.div
                                    className="ht-sleep-bar-light"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${d.light}%` }}
                                    transition={{ duration: 0.7, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
                                />
                            </div>
                            <span className="ht-bar-label">{d.day}</span>
                        </div>
                    ))}
                </div>
                <div className="ht-sleep-legend-grid">
                    {[
                        { color: '#9b5de5', label: 'Deep sleep' },
                        { color: '#e879f9', label: 'Light sleep' },
                        { color: '#c084fc', label: 'REM phase' },
                        { color: '#f3e8ff', label: 'Awake' },
                    ].map((l, i) => (
                        <div key={i} className="ht-sleep-legend-item">
                            <span className="ht-legend-dot" style={{ background: l.color }} />
                            <span className="ht-legend-text">{l.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Tip Card ── */}
            <motion.div
                className="ht-sleep-tip-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
            >
                <div className="ht-sleep-tip-icon">😴</div>
                <div className="ht-sleep-tip-body">
                    <p className="ht-sleep-tip-title">Tip for Healthy Sleep</p>
                    <p className="ht-sleep-tip-sub">
                        Try to go to bed and wake up at the same time, regardless of the day of the week.
                    </p>
                </div>
            </motion.div>

        </motion.div >
    );
}