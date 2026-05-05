import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  BellOff, 
  Settings, 
  Moon, 
  Globe, 
  Users, 
  HelpCircle, 
  FileText, 
  Shield, 
  LogOut 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { dispatch } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <header className="profile-header">
        <button className="profile-back-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="profile-title">settings</h1>
        <div className="header-spacer" />
      </header>

      <div className="settings-content">
        {/* User Card */}
        <div className="user-profile-card" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'edit-profile' })}>
          <div className="user-avatar-container">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Deep" 
              alt="User Avatar" 
              className="user-avatar-img"
            />
          </div>
          <div className="user-info">
            <h2 className="user-name">Deepjyoti</h2>
            <span className="user-handle">@deep_discipline</span>
          </div>
          <ChevronRight size={18} className="card-chevron" />
        </div>

        {/* Settings Groups */}
        <div className="settings-group">
          <div className="setting-row">
            <div className="setting-left">
              <BellOff size={18} />
              <span>pause notifications</span>
            </div>
            <button 
              className={`toggle-track ${notifications ? 'active-lime' : ''}`}
              onClick={() => setNotifications(!notifications)}
            >
              <div className="toggle-thumb"></div>
            </button>
          </div>
          
          <div className="setting-row clickable">
            <div className="setting-left">
              <Settings size={18} />
              <span>general settings</span>
            </div>
            <ChevronRight size={18} className="row-chevron" />
          </div>
        </div>

        <div className="settings-group">
          <div className="setting-row">
            <div className="setting-left">
              <Moon size={18} />
              <span>dark mode</span>
            </div>
            <button 
              className={`toggle-track ${darkMode ? 'active-grey' : ''}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              <div className="toggle-thumb"></div>
            </button>
          </div>

          <div className="setting-row clickable">
            <div className="setting-left">
              <Globe size={18} />
              <span>language</span>
            </div>
            <ChevronRight size={18} className="row-chevron" />
          </div>

          <div className="setting-row clickable">
            <div className="setting-left">
              <Users size={18} />
              <span>my contacts</span>
            </div>
            <ChevronRight size={18} className="row-chevron" />
          </div>
        </div>

        <div className="settings-group">
          <div className="setting-row clickable">
            <div className="setting-left">
              <HelpCircle size={18} />
              <span>FAQ</span>
            </div>
            <ChevronRight size={18} className="row-chevron" />
          </div>

          <div className="setting-row clickable">
            <div className="setting-left">
              <FileText size={18} />
              <span>terms of service</span>
            </div>
            <ChevronRight size={18} className="row-chevron" />
          </div>

          <div className="setting-row clickable">
            <div className="setting-left">
              <Shield size={18} />
              <span>user policy</span>
            </div>
            <ChevronRight size={18} className="row-chevron" />
          </div>
        </div>

        {/* Log Out Button */}
        <button className="logout-btn">
          <LogOut size={18} className="logout-icon" />
          <span>log out</span>
        </button>
      </div>
    </motion.div>
  );
}
