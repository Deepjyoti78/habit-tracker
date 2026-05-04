import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Flame } from 'lucide-react';
import CalendarStrip from '../components/CalendarStrip';
import DailyCheckin from '../components/DailyCheckin';
import HabitCard from '../components/HabitCard';
import OverallProgressCard from '../components/OverallProgressCard';
import RemainingTasksCard from '../components/RemainingTasksCard';
import TaskRemainingCard from '../components/TaskRemainingCard';
import AIInsights from '../components/AIInsights';
import Heatmap from '../components/Heatmap';
import PlannerCard from '../components/PlannerCard';
import './HomePage.css';

export default function HomePage() {
  const { dispatch } = useApp();

  const now = new Date();
  const dateStr = now
    .toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
    .toUpperCase();

  const hour = now.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  return (
    <motion.div
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-text-block">
          <h1 className="hero-heading">{greeting}, Deep!</h1>
          <span className="hero-subtitle">Let's build some discipline today.</span>
        </div>
        <div className="hero-rating-badge">
          <Flame size={14} color="#c4fb31" />
          <span>12 Day Streak</span>
        </div>
      </section>

      {/* Calendar - Full Width */}
      <CalendarStrip />

      {/* Bento Grid */}
      <div className="home-bento-grid">
        <div className="home-left-col">
          <OverallProgressCard />
          <RemainingTasksCard />
          <TaskRemainingCard />
        </div>
        
        <div className="home-right-col">
          <HabitCard />
        </div>
      </div>

      <DailyCheckin />
    </motion.div>
  );
}
