import React from 'react';
import { Flame, CheckCircle2, Circle, MessageSquare, Waves, Utensils, Brush, Dumbbell, Code, Book } from 'lucide-react';
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

  return (
    <div className="habit-minimal-card">
      <div className="habit-minimal-header">
        <span className="habit-minimal-name">
          {habit.name || habit.text}
        </span>
        <div className="habit-minimal-streak">
          <span>{habit.streak || 0}</span>
          <Flame size={14} fill="#f97316" color="#f97316" />
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
