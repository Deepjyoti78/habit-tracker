import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Heatmap from '../components/Heatmap';
import OverallProgressCard from '../components/OverallProgressCard';
import HabitProgressCard from '../components/HabitProgressCard';
import ScoreCard from '../components/ScoreCard';
import './AnalyticsPage.css';



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

      <motion.path
        d={areaD}
        fill="url(#moodGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      />

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

      {/* Discipline Score Card */}
      <ScoreCard />

      {/* Mood Chart */}
      <MoodChart />

      {/* Per-Habit Progress & Heatmap Cards */}
      {state.habits.length > 0 && (
        <motion.div
          className="habit-progress-section"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header" style={{ marginBottom: '12px' }}>
            <span className="card-title">habit statistics & streaks</span>
            <span className="analytics-chart-label">{state.habits.length} habits</span>
          </div>
          <div className="habit-progress-grid">
            {state.habits.map((habit, i) => (
              <HabitProgressCard key={habit.id || i} habit={habit} index={i} />
            ))}
          </div>
        </motion.div>
      )}

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