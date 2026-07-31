import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Dumbbell, Briefcase, MessageCircle, Smile, Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CategoryGrid.css';

const CATEGORIES = [
  {
    id: 'dsa',
    label: 'DSA',
    subtitle: 'Striver\'s A2Z Sheet',
    icon: Code2,
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.08)',
  },
  {
    id: 'cardio',
    label: 'Cardio',
    subtitle: 'Daily workout',
    icon: Dumbbell,
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.08)',
  },
  {
    id: 'internship',
    label: 'Internship',
    subtitle: 'Applications & prep',
    icon: Briefcase,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.08)',
  },
  {
    id: 'communication',
    label: 'Communication',
    subtitle: 'Practice & record',
    icon: MessageCircle,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.08)',
  },
  {
    id: 'face-exercise',
    label: 'Face Exercise',
    subtitle: 'Neck & jaw routine',
    icon: Smile,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.08)',
  },
  {
    id: 'water',
    label: 'Drink 3L Water',
    subtitle: 'Stay hydrated',
    icon: Droplets,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.08)',
  },
];

export default function CategoryGrid() {
  const { dispatch } = useApp();

  const handleOpen = (cat) => {
    dispatch({ type: 'SET_WORKSPACE', payload: cat.id });
    dispatch({ type: 'SET_PAGE', payload: 'workspace' });
  };

  return (
    <div className="cg-grid">
      {CATEGORIES.map((cat, i) => {
        const Icon = cat.icon;
        return (
          <motion.button
            key={cat.id}
            className="cg-card"
            style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
            onClick={() => handleOpen(cat)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.96 }}
          >
            <div className="cg-icon-wrap">
              <Icon size={22} strokeWidth={1.8} />
            </div>
            <span className="cg-label">{cat.label}</span>
            <span className="cg-subtitle">{cat.subtitle}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
