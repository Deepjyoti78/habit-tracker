import { motion } from 'framer-motion';
import { Target, Trophy, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import HabitCard from '../components/HabitCard';
import './HabitsPage.css';

export default function HabitsPage() {
  const { state } = useApp();
  const { habits } = state;
  const doneCount = habits.filter((h) => h.done).length;
  const bestStreak = Math.max(...habits.map((h) => h.streak));
  const categories = [...new Set(habits.map((h) => h.category))];

  return (
    <motion.div
      className="habits-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title">Habits</h1>
          <p className="page-subtitle">Track and build your daily systems</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="habits-stats-row">
        <motion.div
          className="habits-stat-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="habits-stat-icon green">
            <Target size={16} />
          </div>
          <div>
            <span className="habits-stat-value">{doneCount}/{habits.length}</span>
            <span className="habits-stat-label">Completed Today</span>
          </div>
        </motion.div>

        <motion.div
          className="habits-stat-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="habits-stat-icon amber">
            <Trophy size={16} />
          </div>
          <div>
            <span className="habits-stat-value">{bestStreak}</span>
            <span className="habits-stat-label">Best Streak</span>
          </div>
        </motion.div>

        <motion.div
          className="habits-stat-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="habits-stat-icon accent">
            <Zap size={16} />
          </div>
          <div>
            <span className="habits-stat-value">{categories.length}</span>
            <span className="habits-stat-label">Categories</span>
          </div>
        </motion.div>
      </div>

      {/* Full habit card */}
      <HabitCard compact={false} />

      {/* Categories breakdown */}
      <motion.div
        className="habits-categories"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card-header">
          <span className="card-title">By Category</span>
        </div>
        <div className="habits-cat-grid">
          {categories.map((cat) => {
            const catHabits = habits.filter((h) => h.category === cat);
            const catDone = catHabits.filter((h) => h.done).length;
            const pct = Math.round((catDone / catHabits.length) * 100);
            return (
              <div key={cat} className="habits-cat-item">
                <div className="habits-cat-info">
                  <span className="habits-cat-name">{cat}</span>
                  <span className="habits-cat-count">
                    {catDone}/{catHabits.length}
                  </span>
                </div>
                <div className="habits-cat-bar">
                  <motion.div
                    className="habits-cat-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
