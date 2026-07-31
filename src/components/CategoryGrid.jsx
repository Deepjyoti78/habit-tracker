import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Dumbbell, Briefcase, MessageCircle, Smile, Droplets, Terminal, Activity, Rocket, Mic, Sparkles, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CategoryGrid.css';

const CATEGORIES = [
  {
    id: 'dsa',
    label: 'DSA',
    subtitle: 'Striver\'s A2Z Sheet',
    icon: Terminal,
    bgIcon: Code2,
    color: '#f87171',
    bg: 'rgba(248, 113, 113, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(248, 113, 113, 0.15) 0%, rgba(248, 113, 113, 0) 100%)',
  },
  {
    id: 'cardio',
    label: 'Cardio',
    subtitle: 'Daily workout',
    icon: Activity,
    bgIcon: Dumbbell,
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0) 100%)',
  },
  {
    id: 'internship',
    label: 'Internship',
    subtitle: 'Applications & prep',
    icon: Rocket,
    bgIcon: Briefcase,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0) 100%)',
  },
  {
    id: 'communication',
    label: 'Communication',
    subtitle: 'Practice & record',
    icon: Mic,
    bgIcon: MessageCircle,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(52, 211, 153, 0) 100%)',
  },
  {
    id: 'face-exercise',
    label: 'Face Exercise',
    subtitle: 'Neck & jaw routine',
    icon: Sparkles,
    bgIcon: Smile,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.15) 0%, rgba(167, 139, 250, 0) 100%)',
  },
  {
    id: 'water',
    label: 'Drink 3L Water',
    subtitle: 'Stay hydrated',
    icon: Coffee,
    bgIcon: Droplets,
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.05)',
    gradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0) 100%)',
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
        const BgIcon = cat.bgIcon;
        return (
          <motion.button
            key={cat.id}
            className="cg-card"
            style={{ 
              '--cat-color': cat.color, 
              '--cat-bg': cat.bg,
              '--cat-gradient': cat.gradient
            }}
            onClick={() => handleOpen(cat)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Background Illustration */}
            <div className="cg-bg-illustration">
              <BgIcon size={160} strokeWidth={0.5} />
            </div>

            <div className="cg-content">
              <div className="cg-icon-wrap">
                <Icon size={24} strokeWidth={2} />
              </div>
              
              <div className="cg-text-wrap">
                <span className="cg-label">{cat.label}</span>
                <span className="cg-subtitle">{cat.subtitle}</span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
