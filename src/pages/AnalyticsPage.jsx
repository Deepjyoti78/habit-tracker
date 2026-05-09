import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyticsData } from '../data/appData';
import Heatmap from '../components/Heatmap';
import OverallProgressCard from '../components/OverallProgressCard';
import './AnalyticsPage.css';

/* ── Mini Bar Chart ── */
function MiniBarChart({ data, maxVal, color }) {
  const max = maxVal || Math.max(...data);
  return (
    <div className="mini-bar-chart">
      {data.map((val, i) => (
        <motion.div
          key={i}
          className="mini-bar"
          style={{ '--bar-color': color || '#c4fb31' }}
          initial={{ height: 0 }}
          animate={{ height: `${(val / max) * 100}%` }}
          transition={{ duration: 0.5, delay: 0.2 + i * 0.04, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

/* ── Category Ring ── */
function CategoryRing({ category, index }) {
  const r = 26;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * category.score) / 100;

  return (
    <motion.div
      className="analytics-cat-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.07 }}
    >
      <div className="analytics-cat-ring">
        <svg width="62" height="62" viewBox="0 0 62 62">
          <path
            d={`M 31 31 m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0`}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4.5"
          />
          <motion.path
            d={`M 31 31 m -${r} 0 a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 -${r * 2} 0`}
            fill="none"
            stroke={category.color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <span className="analytics-cat-ring-val">{category.score}%</span>
      </div>
      <span className="analytics-cat-name">{category.name}</span>
    </motion.div>
  );
}

/* ── Mini Habit Heatmap ── */
function MiniHeatmap({ habit, index }) {
  const WEEKS = 15;
  const DAYS = 7;
  const total = WEEKS * DAYS;

  // Generate mock data based on habit — replace with real log data if available
  const cells = Array.from({ length: total }, (_, i) => {
    if (!habit.logs || habit.logs.length === 0) {
      // Random mock data seeded by habit id + index
      const seed = (habit.id?.charCodeAt?.(0) || index + 1) * (i + 1);
      const rand = ((seed * 1664525 + 1013904223) & 0xffffffff) / 0xffffffff;
      if (rand > 0.65) return Math.random() > 0.5 ? 2 : 3;
      if (rand > 0.45) return 1;
      return 0;
    }
    // Real log matching
    const cellDate = new Date();
    cellDate.setDate(cellDate.getDate() - (total - 1 - i));
    const dateStr = cellDate.toDateString();
    const logged = habit.logs?.some(log => {
      const d = new Date(log.date || log.timestamp || log);
      return d.toDateString() === dateStr;
    });
    return logged ? 3 : 0;
  });

  const color = habit.color || ['#f59e0b', '#22c55e', '#a855f7', '#3b82f6', '#ef4444', '#06b6d4'][index % 6];

  const getOpacity = (val) => {
    if (val === 0) return 'rgba(255,255,255,0.04)';
    if (val === 1) return `${color}40`;
    if (val === 2) return `${color}80`;
    return color;
  };

  return (
    <motion.div
      className="habit-heatmap-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06 }}
    >
      <div className="habit-heatmap-header">
        <div className="habit-heatmap-left">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
          <span className="habit-heatmap-name">{habit.name || habit.title || 'habit'}</span>
        </div>
        <span className="habit-heatmap-streak">
          {habit.streak || Math.floor(Math.random() * 14)}d streak
        </span>
      </div>

      <div className="habit-heatmap-grid">
        {Array.from({ length: DAYS }, (_, row) => (
          <div key={row} className="habit-heatmap-row">
            {Array.from({ length: WEEKS }, (_, col) => {
              const cellIdx = col * DAYS + row;
              const val = cells[cellIdx] || 0;
              return (
                <div
                  key={col}
                  className="habit-heatmap-cell"
                  style={{ background: getOpacity(val) }}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="habit-heatmap-footer">
        <span className="habit-heatmap-less">less</span>
        {[0.08, 0.25, 0.5, 1].map((op, i) => (
          <div
            key={i}
            className="habit-heatmap-legend-cell"
            style={{ background: op < 0.15 ? 'rgba(255,255,255,0.06)' : `${color}${Math.round(op * 255).toString(16).padStart(2, '0')}` }}
          />
        ))}
        <span className="habit-heatmap-more">more</span>
      </div>
    </motion.div>
  );
}

/* ── Smooth Line Path ── */
function smoothLine(points) {
  if (points.length === 0) return '';
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const xc = (p0[0] + p1[0]) / 2;
    d += ` C ${xc} ${p0[1]}, ${xc} ${p1[1]}, ${p1[0]} ${p1[1]}`;
  }
  return d;
}

/* ── Mood Chart ── */
function MoodChart() {
  const chartData = [80, 20, 30, 10, 50, 40, 65];
  const vWidth = 320;
  const vHeight = 130;
  const paddingX = 10;
  const paddingY = 16;
  const chartWidth = vWidth - paddingX * 2 - 56;

  const [activePoint, setActivePoint] = useState(null);

  const moodLevels = ['awesome', 'fine', 'neutral', 'bad', 'very low'];
  const xLabels = ['tu', 'we', 'th', 'fr', 'sa', 'su', 'mo'];

  const points = chartData.map((val, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * chartWidth;
    const y = vHeight - paddingY - (val / 100) * (vHeight - 2 * paddingY);
    return [x, y, val];
  });

  const pathD = smoothLine(points);

  /* gradient area fill */
  const areaD = pathD + ` L ${points[points.length - 1][0]} ${vHeight - paddingY} L ${points[0][0]} ${vHeight - paddingY} Z`;

  return (
    <motion.div
      className="mood-chart-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
    >
      <div className="mood-chart-header">
        <h3 className="mood-chart-title">mood this week</h3>
        <span className="mood-chart-date">5–11 apr 2025</span>
      </div>

      <svg viewBox={`0 0 ${vWidth} ${vHeight}`} className="mood-svg">
        <defs>
          <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4fb31" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#c4fb31" stopOpacity="0" />
          </linearGradient>
        </defs>

      {/* Grid lines */}
      {moodLevels.map((lbl, i) => {
        const y = paddingY + (i / (moodLevels.length - 1)) * (vHeight - 2 * paddingY);
        return (
          <g key={lbl}>
            <line
              x1={paddingX} y1={y}
              x2={paddingX + chartWidth} y2={y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
            <text
              x={paddingX + chartWidth + 8}
              y={y + 4}
              fill="rgba(255,255,255,0.25)"
              fontSize="9"
              fontWeight="500"
            >
              {lbl}
            </text>
          </g>
        );
      })}

      {/* Area fill */}
      <motion.path
        d={areaD}
        fill="url(#moodGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="#c4fb31"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
      />

      {/* Dots + hit areas */}
      {points.map((p, i) => (
        <g key={i}>
          <motion.circle
            cx={p[0]} cy={p[1]} r="3"
            fill="#c4fb31"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: activePoint === i ? 1.6 : 1, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.06 }}
          />
          <circle
            cx={p[0]} cy={p[1]} r="14"
            fill="transparent"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setActivePoint(i)}
            onMouseLeave={() => setActivePoint(null)}
            onClick={() => setActivePoint(activePoint === i ? null : i)}
          />
          {activePoint === i && (
            <g style={{ pointerEvents: 'none' }}>
              <line
                x1={p[0]} y1={p[1] + 4}
                x2={p[0]} y2={vHeight - paddingY}
                stroke="rgba(196,251,49,0.25)"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <rect
                x={Math.min(p[0] - 22, paddingX + chartWidth - 44)}
                y={p[1] - 38}
                width="44" height="28"
                rx="7"
                fill="#1c1c1c"
                stroke="rgba(196,251,49,0.2)"
                strokeWidth="1"
              />
              <text
                x={Math.min(p[0], paddingX + chartWidth - 22)}
                y={p[1] - 26}
                fill="rgba(255,255,255,0.4)"
                fontSize="8"
                textAnchor="middle"
              >
                {xLabels[i]}
              </text>
              <text
                x={Math.min(p[0], paddingX + chartWidth - 22)}
                y={p[1] - 14}
                fill="#c4fb31"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                {p[2]}%
              </text>
            </g>
          )}
        </g>
      ))}

      {/* X labels */}
      {xLabels.map((lbl, i) => {
        const x = paddingX + (i / (xLabels.length - 1)) * chartWidth;
        return (
          <text
            key={lbl} x={x} y={vHeight - 1}
            fill="rgba(255,255,255,0.3)"
            fontSize="9"
            textAnchor="middle"
            fontWeight="600"
          >
            {lbl}
          </text>
        );
      })}
    </svg>
    </motion.div >
  );
}

/* ── Page ── */
export default function AnalyticsPage() {
  const { dispatch, state } = useApp();
  const { weeklyScores, monthlyScores, categoryBreakdown } = analyticsData;

  return (
    <motion.div
      className="analytics-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <header className="analytics-header">
        <button
          className="analytics-back-btn"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
        >
          <ChevronLeft size={18} />
        </button>
        <h1 className="analytics-title">analytics</h1>
        <div className="header-spacer" />
      </header>

      {/* Overall Progress */}
      <OverallProgressCard />

      {/* Mood Chart */}
      <MoodChart />

      {/* Bar Charts */}
      <div className="analytics-grid">
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <span className="card-title">weekly trend</span>
            <span className="analytics-chart-label">7 days</span>
          </div>
          <div className="analytics-chart-container">
            <MiniBarChart data={weeklyScores} maxVal={100} color="#c4fb31" />
            <div className="analytics-chart-x-labels">
              {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="card-header">
            <span className="card-title">monthly trend</span>
            <span className="analytics-chart-label">12 weeks</span>
          </div>
          <div className="analytics-chart-container">
            <MiniBarChart data={monthlyScores} maxVal={100} color="#a78bfa" />
            <div className="analytics-chart-x-labels wide">
              {['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 'w12'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      <motion.div
        className="analytics-categories-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card-header">
          <span className="card-title">category performance</span>
        </div>
        <div className="analytics-cats-grid">
          {categoryBreakdown.map((cat, i) => (
            <CategoryRing key={cat.name} category={cat} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Per-Habit Heatmaps */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <div className="habit-heatmaps-section">
          <div className="card-header" style={{ marginBottom: '10px' }}>
            <span className="card-title">habit streaks</span>
            <span className="analytics-chart-label">{state.habits.length} habits</span>
          </div>
          {state.habits.length === 0 ? (
            <div className="habit-heatmap-empty">no habits yet — add some!</div>
          ) : (
            state.habits.map((habit, i) => (
              <MiniHeatmap key={habit.id || i} habit={habit} index={i} />
            ))
          )}
        </div>
      </motion.div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Heatmap />
      </motion.div>

    </motion.div>
  );
}