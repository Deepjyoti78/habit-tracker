import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Calendar, BarChart2, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getHabits, getHabitLogs } from '../api/habits';
import HabitLargeCard from '../components/HabitLargeCard';
import CalendarStrip from '../components/CalendarStrip';
import Heatmap from '../components/Heatmap';
import './HabitsPage.css';

export default function HabitsPage() {
  const { state, dispatch } = useApp();
  const { habits } = state;
  const [viewMode, setViewMode] = useState('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [successRate, setSuccessRate] = useState(0);
  const [avgStreak, setAvgStreak] = useState(0);
  const [loading, setLoading] = useState(!habits || habits.length === 0);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const res = await getHabits();
        dispatch({ type: 'SET_HABITS', payload: res.data });
        setLoading(false); // Show cards immediately after habits are fetched

        // Calculate stats in background
        const logsResults = await Promise.all(
          res.data.map(h => getHabitLogs(h.id))
        );

        let totalDone = 0, totalLogs = 0, totalStreak = 0;
        logsResults.forEach((logsRes) => {
          const logs = logsRes.data;
          totalLogs += logs.length;
          totalDone += logs.filter(l => l.done).length;

          let streak = 0;
          const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
          for (const log of sortedLogs) {
            if (log.done) streak++;
            else break;
          }
          totalStreak += streak;
        });

        setSuccessRate(totalLogs > 0 ? Math.round((totalDone / totalLogs) * 100) : 0);
        setAvgStreak(res.data.length > 0 ? Math.round(totalStreak / res.data.length) : 0);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchHabits();
  }, []);

  const coreDisciplines = habits.filter(h => h.is_core);
  const regularHabits = habits.filter(h => !h.is_core);

  return (
    <motion.div
      className="habits-page-v2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="h-page-header">
        <button
          className="h-header-btn-circle"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="h-page-title">habits</h1>
        {habits.length > 0 ? (
          <button
            className="h-add-habit-btn-pill"
            onClick={() => dispatch({ type: 'SET_ADD_HABIT_MODAL', payload: true })}
          >
            <Plus size={18} />
            <span>add habit</span>
          </button>
        ) : (
          <div style={{ width: 40 }} />
        )}
      </header>

      {/* Calendar - Restored */}
      <div className="h-page-calendar-section-home">
        <CalendarStrip
          hideHeader={true}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
      </div>

      <div className="h-content-controls">
        <h2 className="h-section-label">
          {selectedDate.toDateString() === new Date().toDateString()
            ? 'today'
            : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
            initial={false} // Pop in instantly
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
          >
            {loading ? (
              <div className="h-loading-state">
                {[1, 2, 3].map(i => (
                  <div className="h-skeleton-card" key={i} />
                ))}
              </div>
            ) : habits.length === 0 ? (
              <div className="h-empty-state">
                <div className="h-empty-icon-ring">
                  <Flame size={28} />
                </div>
                <p className="h-empty-title">no habits yet</p>
                <p className="h-empty-sub">
                  start building your streak — add your first habit below
                </p>
                <button
                  className="h-empty-cta"
                  onClick={() => dispatch({ type: 'SET_ADD_HABIT_MODAL', payload: true })}
                >
                  <Plus size={14} />
                  add first habit
                </button>
              </div>
            ) : (
              <>
                {coreDisciplines.length > 0 && (
                  <>
                    <p className="h-group-label">core disciplines</p>
                    {coreDisciplines.map(habit => (
                      <HabitLargeCard key={habit.id} habit={habit} />
                    ))}
                  </>
                )}
                {regularHabits.length > 0 && (
                  <>
                    {coreDisciplines.length > 0 && (
                      <p className="h-group-label">other habits</p>
                    )}
                    {regularHabits.map(habit => (
                      <HabitLargeCard key={habit.id} habit={habit} />
                    ))}
                  </>
                )}
              </>
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
              <h3 className="h-stats-title">performance heatmap</h3>
              <p className="h-stats-subtitle">your activity across all disciplines</p>
              <div className="h-heatmap-wrapper">
                <Heatmap />
              </div>
            </div>
            <div className="h-mini-stats-grid">
              <div className="h-mini-stat-card">
                <span className="h-mini-val">{successRate}%</span>
                <span className="h-mini-label">success rate</span>
              </div>
              <div className="h-mini-stat-card">
                <span className="h-mini-val">{avgStreak}d</span>
                <span className="h-mini-label">avg. streak</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}