import React from 'react';
import { Home, Activity, PieChart, CalendarDays, Timer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import GrainOverlay from './GrainOverlay';
import './MobileNavbar.css';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'habits', label: 'Habits', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'planner', label: 'Planner', icon: CalendarDays },
  { id: 'timer', label: 'Timer', icon: Timer },
];

export default function MobileNavbar() {
  const { state, dispatch } = useApp();
  const { currentPage } = state;

  // Hide navbar on these pages completely
  const hideOnPages = ['profile', 'edit-profile', 'create-habit', 'tracker'];
  if (hideOnPages.includes(currentPage)) return null;

  const getActivePage = () => {
    return navItems.find(i => i.id === currentPage) ? currentPage : 'home';
  };

  const activePage = getActivePage();

  return (
    <nav className="mobile-navbar">
      <GrainOverlay opacity={0.15} />
      {navItems.map((item) => {
        const isActive = activePage === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <AnimatePresence>
              {isActive && (
                <motion.span
                  className="mobile-nav-label"
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: "auto", marginLeft: 8 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  {item.label.toLowerCase()}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </nav>
  );
}