import React from 'react';
import { Flame, CheckCircle2, Circle, MessageSquare, Waves, Utensils, Brush, Dumbbell, Code, Book, Droplets, MoreVertical, Zap, Target } from 'lucide-react';
import './HabitGridCard.css';

const HabitGridCard = ({ habit }) => {
  // Generate 8 months of data (4 weeks each = 28 days * 8 = 224 days)
  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = months.map((month, mIdx) => {
    return Array.from({ length: 28 }, (_, i) => {
      const seed = Math.sin(habit.id * 10 + mIdx * 28 + i) * 10000;
      const random = seed - Math.floor(seed);
      return random > 0.45;
    });
  });

  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const getHabitIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('water')) return <Droplets size={18} color="#6c63ff" />;
    if (n.includes('run') || n.includes('swimming')) return <Zap size={18} color="#10b981" />;
    if (n.includes('read') || n.includes('communication')) return <Book size={18} color="#f59e0b" />;
    return <Target size={18} color="#6c63ff" />;
  };

  const getHabitDesc = (name) => {
    const n = name.toLowerCase();
    if (n.includes('water')) return 'stay hydrated, feel better';
    if (n.includes('run')) return 'start strong, build momentum';
    if (n.includes('swimming')) return 'full body discipline';
    if (n.includes('communication')) return 'master your voice';
    return 'track and build daily systems';
  };

  return (
    <div className="habit-minimal-card">
      <div className="habit-card-header-new">
        <div className="habit-header-left">
          <div className="habit-icon-square">
            {getHabitIcon(habit.name || habit.text)}
          </div>
          <div className="habit-title-group">
            <span className="habit-minimal-name">{habit.name || habit.text}</span>
            <span className="habit-minimal-desc">{getHabitDesc(habit.name || habit.text)}</span>
          </div>
        </div>
        <div className="habit-header-right">
          <div className="habit-minimal-streak">
            <span>{habit.streak || 0}</span>
            <Flame size={14} fill="#f97316" color="#f97316" />
          </div>
          <button className="habit-more-btn">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="habit-minimal-content">
        <div className="habit-months-row">
          {data.map((monthData, mIdx) => (
            <div key={mIdx} className="month-block">
              <div className="month-grid">
                {monthData.map((done, i) => (
                  <div 
                    key={i} 
                    className={`grid-cell ${done ? 'done' : ''}`}
                    style={{ 
                      backgroundColor: done ? habit.color : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>
              <span className="month-label">{months[mIdx]}</span>
            </div>
          ))}
          
          <div className="day-labels-column">
            {dayLabels.map((label, i) => (
              <span key={i} className="day-label-tiny">{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitGridCard;
