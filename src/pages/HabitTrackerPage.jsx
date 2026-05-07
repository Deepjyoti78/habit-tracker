import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

import WaterTrackerPage from './trackers/WaterTrackerPage';
import SleepTrackerPage from './trackers/SleepTrackerPage';
import StudyTrackerPage from './trackers/StudyTrackerPage';
import MindTrackerPage from './trackers/MindTrackerPage';

import './HabitTrackerPage.css';

export default function HabitTrackerPage() {
    const { state, dispatch } = useApp();
    const { selectedHabitId } = state;

    const habit = state.habits.find(h => h.id === selectedHabitId) || state.habits[0];

    if (!habit) {
        dispatch({ type: 'SET_PAGE', payload: 'habits' });
        return null;
    }

    const renderTracker = () => {
        const type = habit.trackingType || habit.tracking_type;
        switch (type) {
            case 'water': return <WaterTrackerPage habit={habit} />;
            case 'sleep': return <SleepTrackerPage habit={habit} />;
            case 'mind': return <MindTrackerPage habit={habit} />;
            case 'study':
            default: return <StudyTrackerPage habit={habit} />;
        }
    };

    return (
        <motion.div
            className="ht-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Background glow */}
            <div className="ht-bg-glow" style={{ backgroundColor: habit.color }} />

            {/* Header */}
            <header className="ht-header">
                <motion.button
                    className="ht-back-btn"
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}
                    whileTap={{ scale: 0.92 }}
                >
                    <ChevronLeft size={20} />
                </motion.button>
                <h1 className="ht-title">{habit.name.toLowerCase()} tracking</h1>
                <button className="ht-more-btn">
                    <MoreHorizontal size={20} />
                </button>
            </header>

            {/* Tracker content — renders the correct tracker page */}
            {renderTracker()}

        </motion.div>
    );
}