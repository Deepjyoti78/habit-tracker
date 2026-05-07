import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Camera, Check, Trash2 } from 'lucide-react';
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

  // Phone: strip everything except digits and leading +
  const setPhone = (e) => {
    const raw = e.target.value;
    const clean = raw.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    setForm({ ...form, phone: clean });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      className="ep-page"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <header className="ep-header">
        <button
          className="ep-back-btn"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="ep-title">edit profile</h1>
        <button
          className={`ep-save-btn ${saved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? <><Check size={13} /> saved</> : 'save'}
        </button>
      </header>

      {/* Avatar — horizontal inline row */}
      <div className="ep-avatar-section">
        <div className="ep-avatar-wrap">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username || 'user'}`}
            alt="avatar"
            className="ep-avatar-img"
          />
          <div className="ep-camera-btn">
            <Camera size={11} />
          </div>
        </div>
        <div className="ep-avatar-info">
          <p className="ep-avatar-name">
            {form.name || form.username || 'your name'}
          </p>
          <p className="ep-avatar-hint">tap to change photo</p>
        </div>
      </div>

      {/* Form fields — label left, input right */}
      <div className="ep-form-card">

        <div className="ep-field">
          <label className="ep-label" htmlFor="ep-name">full name</label>
          <input
            id="ep-name"
            className="ep-input"
            type="text"
            value={form.name}
            onChange={set('name')}
            placeholder="enter full name"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        <div className="ep-field">
          <label className="ep-label" htmlFor="ep-username">username</label>
          <input
            id="ep-username"
            className="ep-input"
            type="text"
            value={form.username}
            onChange={set('username')}
            placeholder="enter username"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        <div className="ep-field">
          <label className="ep-label" htmlFor="ep-email">email</label>
          <input
            id="ep-email"
            className="ep-input"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="enter email"
            autoComplete="new-password"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>

        <div className="ep-field">
          <label className="ep-label" htmlFor="ep-phone">phone</label>
          <input
            id="ep-phone"
            className="ep-input"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={setPhone}
            placeholder="enter phone"
            autoComplete="new-password"
            spellCheck="false"
          />
        </div>

      </div>

      {/* Delete — card row style */}
      <div className="ep-danger-card">
        <button className="ep-delete-btn">
          delete account
          <span className="ep-delete-icon">
            <Trash2 size={16} />
          </span>
        </button>
      </div>

    </motion.div>
  );
}
