import React from 'react';
import { Home, Activity, PieChart, CalendarDays, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import './MobileNavbar.css';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'habits', label: 'Habits', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: PieChart },
  { id: 'planner', label: 'Planner', icon: CalendarDays },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function MobileNavbar() {
  const { state, dispatch } = useApp();
  const { currentPage } = state;

  // Use 'home' as active if current page is 'profile' but profile isn't a real page
  const activePage = navItems.find(i => i.id === currentPage) ? currentPage : 'home';

  return (
    <nav className="mobile-navbar">
      {navItems.map((item) => {
        const isActive = activePage === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id === 'profile' ? 'home' : item.id })}
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
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </nav>
  );
}
