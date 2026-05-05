import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Calendar, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import HabitLargeCard from '../components/HabitLargeCard';
import CalendarStrip from '../components/CalendarStrip';
import Heatmap from '../components/Heatmap';
import './HabitsPage.css';

export default function HabitsPage() {
  const { state, dispatch } = useApp();
  const { habits } = state;
  const [viewMode, setViewMode] = useState('list');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Deterministically "randomize" habit progress based on date and habit ID
  const displayHabits = useMemo(() => {
    const dateSeed = selectedDate.getDate() + selectedDate.getMonth() * 31;
    return habits.map(h => {
      // Create a pseudo-random progress between 20% and 100% based on the date
      const hash = (h.id.charCodeAt(0) + dateSeed) % 100;
      const mockProgress = 20 + (hash % 81);
      const mockCurrent = Math.round((mockProgress / 100) * 10);
      
      return {
        ...h,
        progress: mockProgress,
        currentValue: mockCurrent,
        targetValue: 10
      };
    });
  }, [habits, selectedDate]);

  return (
    <motion.div
      className="habits-page-v2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="h-page-header">
        <button className="h-header-btn-circle" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="h-page-title">Habits</h1>
        <button 
          className="h-add-habit-btn-pill"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'add-habit' })}
        >
          <Plus size={18} />
          <span>Add habit</span>
        </button>
      </header>

      <div className="h-page-calendar-section-home">
        <CalendarStrip 
          hideHeader={true} 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
        />
      </div>

      <div className="h-content-controls">
        <h2 className="h-section-label">
          {selectedDate.toDateString() === new Date().toDateString() ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </h2>
        <div className="h-view-toggles">
          <button 
            className={`h-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <Calendar size={16} />
          </button>
          <button 
            className={`h-view-btn ${viewMode === 'stats' ? 'active' : ''}`}
            onClick={() => setViewMode('stats')}
          >
            <BarChart2 size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div 
            key="list"
            className="h-cards-container"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {displayHabits && displayHabits.length > 0 ? (
              displayHabits.map((habit) => (
                <HabitLargeCard key={habit.id} habit={habit} />
              ))
            ) : (
              <div className="empty-state-mini">No habits yet. Add one to start tracking.</div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="stats"
            className="h-stats-container"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-stats-summary-card">
              <h3 className="h-stats-title">Performance Heatmap</h3>
              <p className="h-stats-subtitle">Your activity across all disciplines</p>
              <div className="h-heatmap-wrapper">
                <Heatmap />
              </div>
            </div>
            
            <div className="h-mini-stats-grid">
              <div className="h-mini-stat-card">
                <span className="h-mini-val">92%</span>
                <span className="h-mini-label">Success Rate</span>
              </div>
              <div className="h-mini-stat-card">
                <span className="h-mini-val">12d</span>
                <span className="h-mini-label">Avg. Streak</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
