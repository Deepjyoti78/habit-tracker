import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Clock, Target, ChevronDown } from 'lucide-react';
import { analyticsData } from '../data/appData';
import Heatmap from '../components/Heatmap';
import './AnalyticsPage.css';

function MiniBarChart({ data, maxVal, color }) {
  const max = maxVal || Math.max(...data);
  return (
    <div className="mini-bar-chart">
      {data.map((val, i) => (
        <motion.div
          key={i}
          className="mini-bar"
          style={{
            '--bar-color': color || 'var(--accent)',
          }}
          initial={{ height: 0 }}
          animate={{ height: `${(val / max) * 100}%` }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.05, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

function CategoryRing({ category, index }) {
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (circumference * category.score) / 100;

  return (
    <motion.div
      className="analytics-cat-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08 }}
    >
      <div className="analytics-cat-ring">
        <svg width="68" height="68" viewBox="0 0 68 68">
          <circle cx="34" cy="34" r="28" fill="none" stroke="var(--surface3)" strokeWidth="5" />
          <motion.circle
            cx="34"
            cy="34"
            r="28"
            fill="none"
            stroke={category.color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          />
        </svg>
        <span className="analytics-cat-ring-val">{category.score}%</span>
      </div>
      <span className="analytics-cat-name">{category.name}</span>
    </motion.div>
  );
}

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

function MoodChart() {
  const chartData = [80, 20, 30, 10, 50, 40, null]; 
  const vWidth = 360;
  const vHeight = 160;
  const paddingX = 15;
  const paddingY = 20;

  const points = chartData.filter(v => v !== null).map((val, i) => {
    const x = paddingX + (i / 6) * (vWidth - 2 * paddingX - 70); 
    const y = vHeight - paddingY - (val / 100) * (vHeight - 2 * paddingY);
    return [x, y];
  });

  const pathD = smoothLine(points);
  
  const yLabels = ['awesome', 'fine', 'neutral', 'bad', 'very low'];
  const xLabels = ['Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo'];

  return (
    <motion.div 
      className="mood-chart-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
    >
      <div className="mood-chart-header">
        <h3 className="mood-chart-title">Mood In This Week</h3>
        <span className="mood-chart-date">5-11 April 2025</span>
      </div>
      <div className="mood-chart-body">
        <svg viewBox={`0 0 ${vWidth} ${vHeight}`} className="mood-svg">
          {/* Horizontal Grid Lines & Y-Labels */}
          {yLabels.map((lbl, i) => {
            const y = paddingY + (i / (yLabels.length - 1)) * (vHeight - 2 * paddingY);
            return (
              <g key={lbl}>
                <line x1={paddingX} y1={y} x2={vWidth - 65} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <text x={vWidth - 55} y={y + 4} fill="var(--text3)" fontSize="11" fontWeight="500">{lbl}</text>
              </g>
            );
          })}
          
          {/* Line Path */}
          <motion.path 
            d={pathD} 
            fill="none" 
            stroke="#d9f38e" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          />
          
          {/* End Dot */}
          <motion.circle 
            cx={points[points.length - 1][0]} 
            cy={points[points.length - 1][1]} 
            r="4" 
            fill="#d9f38e" 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7, duration: 0.3 }}
          />

          {/* X Labels */}
          {xLabels.map((lbl, i) => {
            const x = paddingX + (i / 6) * (vWidth - 2 * paddingX - 70);
            return (
              <text key={lbl} x={x} y={vHeight - 2} fill="var(--text3)" fontSize="11" textAnchor="middle">{lbl}</text>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}

function OverallProgressCard() {
  const progress = 89;
  
  return (
    <motion.div className="overall-progress-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="opc-header">
        <span className="opc-subtitle">Tuesday</span>
        <div className="opc-title-row">
          <h2 className="opc-title">daily stats</h2>
          <div className="opc-dropdown">
            <span>Weekly</span>
            <ChevronDown size={14} />
          </div>
        </div>
        <span className="opc-section-title">overview</span>
      </div>

      <div className="opc-body">
        <div className="opc-gauge-container">
          <svg width="110" height="110" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e3365b" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fcd34d" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="url(#gaugeGrad)" 
              strokeWidth="12" 
              strokeLinecap="round" 
              strokeDasharray="263.89" 
              strokeDashoffset={263.89 - (263.89 * progress) / 100}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
        </div>
        <div className="opc-text-container">
          <span className="opc-value">{progress}%</span>
          <span className="opc-label">overall progress</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { weeklyScores, monthlyScores, categoryBreakdown, bestDay, worstDay, bestTime, avgCompletionRate } = analyticsData;

  return (
    <motion.div
      className="analytics-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      {/* Overall Progress */}
      <OverallProgressCard />

      <MoodChart />

      {/* Charts row */}
      <div className="analytics-grid">
        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-header">
            <span className="card-title">Weekly Trend</span>
            <span className="analytics-chart-label">Last 7 days</span>
          </div>
          <div className="analytics-chart-container">
            <MiniBarChart data={weeklyScores} maxVal={100} />
            <div className="analytics-chart-x-labels">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="analytics-chart-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="card-header">
            <span className="card-title">Monthly Trend</span>
            <span className="analytics-chart-label">Last 12 weeks</span>
          </div>
          <div className="analytics-chart-container">
            <MiniBarChart data={monthlyScores} maxVal={100} color="var(--green)" />
            <div className="analytics-chart-x-labels wide">
              {['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category breakdown */}
      <motion.div
        className="analytics-categories-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card-header">
          <span className="card-title">Category Performance</span>
        </div>
        <div className="analytics-cats-grid">
          {categoryBreakdown.map((cat, i) => (
            <CategoryRing key={cat.name} category={cat} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Heatmap */}
      <Heatmap />
    </motion.div>
  );
}
