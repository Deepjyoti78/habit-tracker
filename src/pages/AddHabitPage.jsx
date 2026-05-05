import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Search, ChevronRight, Check, ChevronDown, Clock, RefreshCw, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AddHabitPage.css';

const categories = [
  { id: 'health', label: 'health', iconName: 'health', color: '#ff4b4b', desc: 'fitness, sleep, nutrition' },
  { id: 'arts', label: 'arts', iconName: 'arts', color: '#6c63ff', desc: 'drawing, music, writing' },
  { id: 'sport', label: 'sport', iconName: 'sport', color: '#f97316', desc: 'running, swimming, gym' },
  { id: 'skills', label: 'skills development', iconName: 'skills', color: '#10b981', desc: 'coding, reading, courses' },
  { id: 'language', label: 'language', iconName: 'language', color: '#3b82f6', desc: 'vocab, practice, fluency' },
  { id: 'mindfulness', label: 'mindfulness', iconName: 'mindfulness', color: '#8b5cf6', desc: 'meditation, journaling' },
];

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const frequencyOptions = ['every day', '3 times / week', 'on weekends', 'custom'];
const repeatOptions = ['1 time / day', '2 times / day', '3 times / day', '5 times / day'];

// Local icon map for selection UI
import { Heart, Palette, Trophy, Target, Globe, Sprout } from 'lucide-react';
const catIconMap = {
  health: Heart,
  arts: Palette,
  sport: Trophy,
  skills: Target,
  language: Globe,
  mindfulness: Sprout
};

export default function AddHabitPage() {
  const { dispatch } = useApp();
  const [expandedCategoryId, setExpandedCategoryId] = React.useState(null);
  const [activeDays, setActiveDays] = React.useState([0, 1, 2, 3, 4]);
  
  const [openDropdown, setOpenDropdown] = React.useState(null);

  const [config, setConfig] = React.useState({
    frequency: 'every day',
    repeats: '1 time / day',
    reminders: true
  });

  const handleAddHabit = (cat) => {
    const newHabit = {
      id: Date.now().toString(),
      name: cat.label,
      category: cat.id,
      icon: cat.iconName, // Store string name for serialization
      color: cat.color,
      streak: 0,
      done: false,
      desc: `${config.frequency}, ${config.repeats}`,
      history: [],
      config: { ...config, activeDays }
    };

    dispatch({ type: 'ADD_HABIT', payload: newHabit });
    dispatch({ type: 'SHOW_TOAST', payload: `Added ${cat.label} habit!` });
    
    setTimeout(() => {
      dispatch({ type: 'SET_PAGE', payload: 'habits' });
      dispatch({ type: 'HIDE_TOAST' });
    }, 1200);
  };

  const toggleDropdown = (type) => {
    setOpenDropdown(openDropdown === type ? null : type);
  };

  const selectOption = (type, value) => {
    setConfig(prev => ({ ...prev, [type]: value }));
    setOpenDropdown(null);
  };

  return (
    <motion.div 
      className="add-habit-page-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <header className="add-habit-header-new">
        <button className="header-icon-box" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}>
          <X size={18} />
        </button>
        <h1 className="add-habit-title">add new habit</h1>
        <button className="header-done-btn-new" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'habits' })}>
          done
        </button>
      </header>

      <div className="search-bar-container">
        <Search size={14} className="search-icon-dim" />
        <input type="text" placeholder="search habits..." className="habit-search-input" />
      </div>

      <div className="categories-list">
        {categories.map((cat) => {
          const isExpanded = expandedCategoryId === cat.id;
          const CatIcon = catIconMap[cat.iconName];
          
          return (
            <div 
              key={cat.id} 
              className={`category-row-new-container ${isExpanded ? 'expanded' : ''}`}
            >
              <div className="category-row-new" onClick={() => {
                setExpandedCategoryId(isExpanded ? null : cat.id);
                setOpenDropdown(null);
              }}>
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

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    className="category-expand-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="expand-inner">
                      <div className="habit-settings-list-mini">
                        <div className="dropdown-wrapper">
                          <div className="setting-item-row-mini dropdown-trigger" onClick={() => toggleDropdown('frequency')}>
                            <div className="setting-left-group">
                              <Clock size={16} className="setting-icon" />
                              <span className="setting-label-mini">frequency</span>
                            </div>
                            <div className="setting-value-mini highlight-val">
                              <span>{config.frequency}</span>
                              <ChevronDown size={14} className={`chevron-transition ${openDropdown === 'frequency' ? 'rotate' : ''}`} />
                            </div>
                          </div>
                          <AnimatePresence>
                            {openDropdown === 'frequency' && (
                              <motion.div 
                                className="dropdown-menu-mini"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                {frequencyOptions.map(opt => (
                                  <div 
                                    key={opt} 
                                    className={`dropdown-option ${config.frequency === opt ? 'active' : ''}`}
                                    onClick={() => selectOption('frequency', opt)}
                                  >
                                    <span>{opt}</span>
                                    {config.frequency === opt && <Check size={12} />}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="dropdown-wrapper">
                          <div className="setting-item-row-mini dropdown-trigger" onClick={() => toggleDropdown('repeats')}>
                            <div className="setting-left-group">
                              <RefreshCw size={16} className="setting-icon" />
                              <span className="setting-label-mini">repeats</span>
                            </div>
                            <div className="setting-value-mini highlight-val">
                              <span>{config.repeats}</span>
                              <ChevronDown size={14} className={`chevron-transition ${openDropdown === 'repeats' ? 'rotate' : ''}`} />
                            </div>
                          </div>
                          <AnimatePresence>
                            {openDropdown === 'repeats' && (
                              <motion.div 
                                className="dropdown-menu-mini"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                {repeatOptions.map(opt => (
                                  <div 
                                    key={opt} 
                                    className={`dropdown-option ${config.repeats === opt ? 'active' : ''}`}
                                    onClick={() => selectOption('repeats', opt)}
                                  >
                                    <span>{opt}</span>
                                    {config.repeats === opt && <Check size={12} />}
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="setting-item-row-mini dropdown-trigger" onClick={() => setConfig(p => ({...p, reminders: !p.reminders}))}>
                          <div className="setting-left-group">
                            <Bell size={16} className="setting-icon" />
                            <span className="setting-label-mini">reminders</span>
                          </div>
                          <div className="setting-value-mini highlight-val">
                            <span className={config.reminders ? 'status-on' : 'status-off'}>
                              {config.reminders ? 'on' : 'off'}
                            </span>
                            <ChevronRight size={14} className="chevron-faint" />
                          </div>
                        </div>
                      </div>

                      <div className="active-days-label-mini-header">ACTIVE DAYS</div>
                      <div className="active-days-section-mini">
                        <div className="days-row-mini">
                          {days.map((day, idx) => (
                            <div 
                              key={idx} 
                              className={`day-circle-mini ${activeDays.includes(idx) ? 'active' : ''} ${idx >= 5 ? 'weekend' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activeDays.includes(idx)) {
                                  setActiveDays(activeDays.filter(d => d !== idx));
                                } else {
                                  setActiveDays([...activeDays, idx]);
                                }
                              }}
                            >
                              {day.toLowerCase()}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        className="add-category-habit-btn vibrant-pop"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddHabit(cat);
                        }}
                      >
                        add this habit
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div 
        className="custom-habit-trigger-dashed" 
        onClick={() => dispatch({ type: 'SET_PAGE', payload: 'create-habit' })}
      >
        <div className="trigger-icon-box">
          <Plus size={16} />
        </div>
        <p className="trigger-text-new">
          couldn't find anything? <span className="highlight-text">create a new tag habit</span>
        </p>
      </div>
    </motion.div>
  );
}
