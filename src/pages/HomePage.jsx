import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Bell, User } from 'lucide-react';
import CalendarStrip from '../components/CalendarStrip';
import ProgressSummaryCard from '../components/ProgressSummaryCard';
import CurrentFocusCard from '../components/CurrentFocusCard';
import HabitCard from '../components/HabitCard';
import CategoryGrid from '../components/CategoryGrid';
import './HomePage.css';

export default function HomePage() {
  const { dispatch } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const now = new Date();
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
      transition={{ duration: 0.2 }}
    >
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-profile-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}>
          <User size={20} />
        </div>
        <div className="hero-text-block">
          <h1 className="hero-heading">{greeting}, Deep!</h1>
          <span className="hero-subtitle">Let's build some discipline today.</span>
        </div>
        <div className="hero-notification-btn">
          <Bell size={20} />
          <div className="notification-dot" />
        </div>
      </section>

      {/* Calendar */}
      <CalendarStrip
        variant="home-desktop"
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* Summary cards */}
      <div className="home-summary-row">
        <ProgressSummaryCard />
      </div>

      {/* Current Focus */}
      <CurrentFocusCard />

      {/* Task list with filters */}
      <HabitCard />

      {/* Category Workspaces */}
      <div className="home-workspaces">
        <div className="home-section-title">Workspaces</div>
        <CategoryGrid />
      </div>
    </motion.div>
  );
}
