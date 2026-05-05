import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './EditProfilePage.css';

export default function EditProfilePage() {
  const { dispatch } = useApp();

  return (
    <motion.div 
      className="edit-profile-page"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <header className="edit-profile-header">
        <button className="edit-back-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="edit-title">edit profile</h1>
        <div className="header-spacer" />
      </header>

      <div className="edit-content">
        {/* Avatar Section */}
        <div className="avatar-edit-section">
          <div className="large-avatar-container">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Deep" 
              alt="User Avatar" 
              className="large-avatar-img"
            />
            <div className="camera-overlay">
              <Camera size={16} />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="edit-form-card">
          <div className="form-row">
            <label className="form-label">full name</label>
            <input type="text" className="form-input" defaultValue="Deepjyoti" />
          </div>
          <div className="form-row">
            <label className="form-label">phone number</label>
            <input type="text" className="form-input" defaultValue="+91 1234-567-890" />
          </div>
          <div className="form-row">
            <label className="form-label">email</label>
            <input type="email" className="form-input" defaultValue="deepjyoti@email.com" />
          </div>
          <div className="form-row">
            <label className="form-label">username</label>
            <input type="text" className="form-input" defaultValue="@deep_discipline" />
          </div>
        </div>

        <button className="save-changes-btn">
          save changes
        </button>

        <button className="delete-account-btn">
          delete account
        </button>
      </div>
    </motion.div>
  );
}
