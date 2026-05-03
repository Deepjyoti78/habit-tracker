import { motion } from 'framer-motion';
import {
  Home,
  CheckCircle2,
  BarChart3,
  CalendarDays,
  Sliders,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Sidebar.css';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'habits', label: 'Habits', icon: CheckCircle2, badge: null },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'planner', label: 'Planner', icon: CalendarDays },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { currentPage, sidebarCollapsed, habits } = state;
  const pendingCount = habits.filter((h) => !h.done).length;

  return (
    <motion.nav
      className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
      initial={false}
      animate={{ width: sidebarCollapsed ? 48 : 210 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Main Inner Block */}
      <div className="sidebar-main-block">
        {/* Top Header / Profile */}
        <div className={`sidebar-logo-row ${sidebarCollapsed ? 'collapsed-row' : ''}`}>
          {!sidebarCollapsed && (
            <div className="sidebar-logo-left">
              <div className="sidebar-avatar-img">
                <img src="https://ui-avatars.com/api/?name=Deep+jyoti+Das&background=1f1f22&color=fff" alt="User" />
              </div>
              <span className="sidebar-logo-text">
                Deep jyoti Das
              </span>
            </div>
          )}
          <button
            className="sidebar-collapse-btn"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            title={sidebarCollapsed ? 'Expand' : 'Collapse'}
          >
            {sidebarCollapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
          </button>
        </div>

        {/* Navigation */}
        <div className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            const badge = item.id === 'habits' ? pendingCount : null;

            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
              >
                <Icon size={16} className="sidebar-nav-icon" />
                {!sidebarCollapsed && (
                  <span className="sidebar-nav-label">{item.label}</span>
                )}
                {!sidebarCollapsed && badge > 0 && (
                  <span className="sidebar-nav-badge">{badge}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Settings Area */}
      <div className="sidebar-footer">
        <button className="sidebar-settings-btn">
          <Sliders size={16} className="sidebar-nav-icon" />
          {!sidebarCollapsed && <span className="sidebar-nav-label">Settings</span>}
        </button>
      </div>
    </motion.nav>
  );
}
