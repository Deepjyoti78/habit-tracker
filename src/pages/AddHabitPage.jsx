import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search, Check, ChevronDown, Clock, RefreshCw, Bell, Star } from 'lucide-react';
import { 
  Heart, Palette, Trophy, Target, Globe, Sprout, 
  Book, Moon, Terminal, MessageSquare, Brain, Droplets 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createHabit } from '../api/habits';
import './AddHabitPage.css';

const categories = [
  { id: 'academic', label: 'Academic', iconName: 'academic', color: '#3b82f6', desc: 'study, research, learning', trackingType: 'study' },
  { id: 'sleep', label: 'Sleep', iconName: 'sleep', color: '#8b5cf6', desc: 'rest, recovery, health', trackingType: 'sleep' },
  { id: 'coding', label: 'Coding', iconName: 'coding', color: '#10b981', desc: 'programming, projects', trackingType: 'study' },
  { id: 'communication', label: 'Communication', iconName: 'communication', color: '#f97316', desc: 'networking, speaking', trackingType: 'study' },
  { id: 'mind', label: 'Mind', iconName: 'mind', color: '#ec4899', desc: 'meditation, mental health', trackingType: 'mind' },
  { id: 'water', label: 'Water', iconName: 'water', color: '#06b6d4', desc: 'hydration, health', trackingType: 'water' },
];

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const frequencyOptions = ['every day', '3 times / week', 'on weekends', 'custom'];
const repeatOptions = ['1 time / day', '2 times / day', '3 times / day', '5 times / day'];

const catIconMap = {
  academic: Book, sleep: Moon, coding: Terminal,
  communication: MessageSquare, mind: Brain, water: Droplets,
};

export default function AddHabitPage() {
  const { dispatch } = useApp();

  // Per-category state — each category tracks its own config independently
  const [expandedCategoryId, setExpandedCategoryId] = React.useState(null);
  const [activeDays, setActiveDays] = React.useState([0, 1, 2, 3, 4]);
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [saving, setSaving] = React.useState(false);

  // isCore and config are now per-expanded category (reset on close)
  const [isCore, setIsCore] = React.useState(false);
  const [config, setConfig] = React.useState({
    frequency: 'every day',
    repeats: '1 time / day',
    reminders: true,
  });

  const handleExpand = (catId) => {
    if (expandedCategoryId === catId) {
      setExpandedCategoryId(null);
    } else {
      setExpandedCategoryId(catId);
      // Reset options for fresh expand
      setIsCore(false);
      setConfig({ frequency: 'every day', repeats: '1 time / day', reminders: true });
      setActiveDays([0, 1, 2, 3, 4]);
      setOpenDropdown(null);
    }
  };

  const handleAddHabit = async (cat) => {
    setSaving(true);
    try {
      const payload = {
        name: cat.label,
        emoji: cat.iconName,
        category: cat.id,
        color: cat.color,
        target_value: parseInt(config.repeats.split(' ')[0]) || 1,
        unit: 'times',
        frequency: config.frequency,
        active_days: activeDays,
        reminder: config.reminders,
        is_core: isCore,
        tracking_type: cat.trackingType,
      };
      const res = await createHabit(payload);
      dispatch({ type: 'ADD_HABIT', payload: res.data });
      dispatch({ type: 'SET_PAGE', payload: 'habits' });
    } catch (err) {
      console.error('Failed to add habit:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="add-habit-page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <header className="add-habit-header-new">
        <button className="header-icon-box" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}>
          <X size={18} />
        </button>
        <h1 className="add-habit-title">add new habit</h1>
        <button className="header-done-btn-new" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}>
          done
        </button>
      </header>

      {/* Search */}
      <div className="search-bar-container">
        <Search size={14} className="search-icon-dim" />
        <input type="text" placeholder="search habits..." className="habit-search-input" />
      </div>

      {/* Categories */}
      <div className="categories-list">
        {categories.map((cat) => {
          const isExpanded = expandedCategoryId === cat.id;
          const CatIcon = catIconMap[cat.iconName];

          return (
            <div key={cat.id} className={`category-row-new-container ${isExpanded ? 'expanded' : ''}`}>

              {/* Category header row */}
              <div className="category-row-new" onClick={() => handleExpand(cat.id)}>
                <div className="category-left">
                  <div className="cat-icon-box" style={{ backgroundColor: `${cat.color}20` }}>
                    <CatIcon size={18} color={cat.color} />
                  </div>
                  <div className="cat-text-group">
                    <span className="cat-label">{cat.label}</span>
                    <span className="cat-desc">{cat.desc}</span>
                  </div>
                </div>
                <button className={`cat-add-btn-bordered ${isExpanded ? 'active' : ''}`}>
                  <Plus size={14} className={isExpanded ? 'rotate-plus' : ''} />
                </button>
              </div>

              {/* Expanded drawer */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="category-expand-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="expand-inner">

                      {/* Settings list */}
                      <div className="habit-settings-list-mini">

                        {/* Core discipline — lives here, makes sense in context */}
                        <div
                          className="setting-item-row-mini"
                          onClick={() => setIsCore(c => !c)}
                        >
                          <div className="setting-left-group">
                            <Star
                              size={15}
                              color={isCore ? '#CCFF00' : 'var(--text2)'}
                              fill={isCore ? '#CCFF00' : 'none'}
                              style={{ opacity: isCore ? 1 : 0.6 }}
                            />
                            <span className="setting-label-mini">core discipline</span>
                          </div>
                          <div className={`inline-toggle ${isCore ? 'on' : ''}`}>
                            <div className="inline-toggle-knob" />
                          </div>
                        </div>

                        {/* Frequency dropdown */}
                        <div className="dropdown-wrapper">
                          <div
                            className="setting-item-row-mini dropdown-trigger"
                            onClick={() => setOpenDropdown(openDropdown === 'frequency' ? null : 'frequency')}
                          >
                            <div className="setting-left-group">
                              <Clock size={15} className="setting-icon" />
                              <span className="setting-label-mini">frequency</span>
                            </div>
                            <div className="setting-value-mini highlight-val">
                              <span>{config.frequency}</span>
                              <ChevronDown size={13} className={`chevron-transition ${openDropdown === 'frequency' ? 'rotate' : ''}`} />
                            </div>
                          </div>
                          <AnimatePresence>
                            {openDropdown === 'frequency' && (
                              <motion.div className="dropdown-menu-mini"
                                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                              >
                                {frequencyOptions.map(opt => (
                                  <div key={opt} className={`dropdown-option ${config.frequency === opt ? 'active' : ''}`}
                                    onClick={() => { setConfig(p => ({ ...p, frequency: opt })); setOpenDropdown(null); }}
                                  >
                                    <span>{opt}</span>
                                    {config.frequency === opt && <Check size={12} />}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Repeats dropdown */}
                        <div className="dropdown-wrapper">
                          <div
                            className="setting-item-row-mini dropdown-trigger"
                            onClick={() => setOpenDropdown(openDropdown === 'repeats' ? null : 'repeats')}
                          >
                            <div className="setting-left-group">
                              <RefreshCw size={15} className="setting-icon" />
                              <span className="setting-label-mini">repeats</span>
                            </div>
                            <div className="setting-value-mini highlight-val">
                              <span>{config.repeats}</span>
                              <ChevronDown size={13} className={`chevron-transition ${openDropdown === 'repeats' ? 'rotate' : ''}`} />
                            </div>
                          </div>
                          <AnimatePresence>
                            {openDropdown === 'repeats' && (
                              <motion.div className="dropdown-menu-mini"
                                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                              >
                                {repeatOptions.map(opt => (
                                  <div key={opt} className={`dropdown-option ${config.repeats === opt ? 'active' : ''}`}
                                    onClick={() => { setConfig(p => ({ ...p, repeats: opt })); setOpenDropdown(null); }}
                                  >
                                    <span>{opt}</span>
                                    {config.repeats === opt && <Check size={12} />}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Reminders toggle */}
                        <div
                          className="setting-item-row-mini"
                          onClick={() => setConfig(p => ({ ...p, reminders: !p.reminders }))}
                        >
                          <div className="setting-left-group">
                            <Bell size={15} className="setting-icon" />
                            <span className="setting-label-mini">reminders</span>
                          </div>
                          <span className={config.reminders ? 'status-on' : 'status-off'}>
                            {config.reminders ? 'on' : 'off'}
                          </span>
                        </div>
                      </div>

                      {/* Active days */}
                      <div className="active-days-label-mini-header">active days</div>
                      <div className="days-row-mini">
                        {days.map((day, idx) => (
                          <div
                            key={idx}
                            className={`day-circle-mini ${activeDays.includes(idx) ? 'active' : ''} ${idx >= 5 ? 'weekend' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDays(activeDays.includes(idx)
                                ? activeDays.filter(d => d !== idx)
                                : [...activeDays, idx]
                              );
                            }}
                          >
                            {day.toLowerCase()}
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <button
                        className="add-category-habit-btn vibrant-pop"
                        disabled={saving}
                        onClick={(e) => { e.stopPropagation(); handleAddHabit(cat); }}
                        style={{ borderLeftColor: cat.color }}
                      >
                        {saving ? 'saving...' : `add ${cat.label}`}
                      </button>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Custom habit CTA */}
      <div className="custom-habit-trigger-dashed" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'create-habit' })}>
        <div className="trigger-icon-box">
          <Plus size={16} />
        </div>
        <p className="trigger-text-new">
          can't find it? <span className="highlight-text">create a custom habit</span>
        </p>
      </div>
    </motion.div>
  );
}
