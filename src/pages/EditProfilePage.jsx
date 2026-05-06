import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './EditProfilePage.css';

export default function EditProfilePage() {
  const { dispatch, state } = useApp();
  const { user } = state;
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fields = [
    { label: 'full name', key: 'name', type: 'text', autoComplete: 'off' },
    { label: 'username', key: 'username', type: 'text', autoComplete: 'off' },
    { label: 'email', key: 'email', type: 'email', autoComplete: 'email' },
    { label: 'phone', key: 'phone', type: 'tel', autoComplete: 'off' },
  ];

  return (
    <motion.div
      className="ep-page"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <header className="ep-header">
        <button className="ep-back-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="ep-title">edit profile</h1>
        <button className={`ep-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
          {saved ? <><Check size={13} /> saved</> : 'save'}
        </button>
      </header>

      {/* Avatar */}
      <div className="ep-avatar-section">
        <div className="ep-avatar-wrap">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username || 'user'}`}
            alt="avatar"
            className="ep-avatar-img"
          />
          <div className="ep-camera-btn">
            <Camera size={14} />
          </div>
        </div>
        <p className="ep-avatar-hint">tap to change photo</p>
      </div>

      {/* Form */}
      <div className="ep-form-card">
        {fields.map(({ label, key, type, autoComplete }) => (
          <div className="ep-field" key={key}>
            <label className="ep-label">{label}</label>
            <input
              className="ep-input"
              type={type}
              value={form[key]}
              onChange={set(key)}
              placeholder={`enter ${label}`}
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              readOnly={false}
            />
          </div>
        ))}
      </div>

      {/* Danger */}
      <button className="ep-delete-btn">
        delete account
      </button>
    </motion.div>
  );
}