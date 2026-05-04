import { motion } from 'framer-motion';
import { Target, Trophy, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import HabitGridCard from '../components/HabitGridCard';
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

      <div className="habits-section-title">Core Disciplines</div>
      
      {/* Grid of Individual Habit Cards */}
      <div className="habits-grid-container">
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <HabitGridCard habit={habit} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
