import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ScoreCard.css';

export default function ScoreCard() {
  const { state } = useApp();
  
  // Calculate stats dynamically from state.habits
  const totalHabits = state.habits.length;
  const doneHabits = state.habits.filter(h => h.done).length;
  const missedHabits = totalHabits - doneHabits;
  
  const score = totalHabits > 0 ? Math.round((doneHabits / totalHabits) * 100) : 78;
  const done = totalHabits > 0 ? doneHabits : 12;
  const missed = totalHabits > 0 ? missedHabits : 5;
  const streak = totalHabits > 0 ? Math.max(...state.habits.map(h => h.streak || 0), 0) : 7;
  const delta = 5;

  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (circumference * score) / 100;

  return (
    <motion.div
      className="score-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="card-header">
        <span className="card-title">Discipline Score</span>
        <button className="card-action" id="score-details-btn">Details →</button>
      </div>

      <div className="score-ring-wrap">
        <div className="score-ring-container">
          <svg width="100" height="100" viewBox="0 0 100 100" className="score-ring-svg">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6c63ff" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--surface3)"
              strokeWidth="7"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <div className="score-ring-value">
            <motion.span
              className="score-big-num"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {score}
            </motion.span>
            <span className="score-percent">%</span>
          </div>
        </div>

        <div className="score-details">
          <div className="score-label">Weekly average</div>
          <div className={`score-delta ${delta >= 0 ? 'up' : 'down'}`}>
            {delta >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{delta >= 0 ? '+' : ''}{delta}% from last week</span>
          </div>
        </div>
      </div>

      <div className="score-stats-row">
        <div className="score-stat">
          <span className="score-stat-val done">{done}</span>
          <span className="score-stat-label">Done</span>
        </div>
        <div className="score-stat">
          <span className="score-stat-val missed">{missed}</span>
          <span className="score-stat-label">Missed</span>
        </div>
        <div className="score-stat">
          <span className="score-stat-val streak">{streak}</span>
          <span className="score-stat-label">Streak</span>
        </div>
      </div>
    </motion.div>
  );
}
