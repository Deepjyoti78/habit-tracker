import React, { useState } from 'react';
import { Droplet, Moon, Sun, Flame, Plus, Minus, Activity } from 'lucide-react';
import './DailyCheckin.css';

export default function DailyCheckin() {
  const [checkins, setCheckins] = useState([
    { id: 'water', label: 'Water', icon: Droplet, current: 6, total: 10, unit: 'Glass', color: '#a881ff' },
    { id: 'sleep', label: 'Sleep', icon: Moon, current: 5, total: 8, unit: 'Hours', color: '#ffffff' },
    { id: 'meditate', label: 'Meditate', icon: Sun, current: 10, total: 15, unit: 'Mins', color: '#ff9a4d' },
    { id: 'read', label: 'Reading', icon: Flame, current: 20, total: 30, unit: 'Pages', color: '#ff6b6b' },
    { id: 'workout', label: 'Workout', icon: Activity, current: 0, total: 1, unit: 'Session', color: '#4dffb8' },
  ]);

  const handleUpdate = (id, increment) => {
    setCheckins(checkins.map(c => {
      if (c.id === id) {
        let newCurrent = c.current + increment;
        if (newCurrent < 0) newCurrent = 0;
        if (newCurrent > c.total) newCurrent = c.total;
        return { ...c, current: newCurrent };
      }
      return c;
    }));
  };

  const completedCount = checkins.filter(c => c.current >= c.total).length;

  return (
    <div className="daily-checkin-section">
      <div className="checkin-header">
        <h3 className="checkin-title">Daily check-in</h3>
        <span className="checkin-count">{completedCount}/{checkins.length}</span>
      </div>
      <div className="checkin-cards-scroll">
        {checkins.map((item) => {
          const progress = (item.current / item.total) * 100;
          return (
            <div key={item.id} className="checkin-card" style={{ '--theme-color': item.color }}>
              <div className="checkin-card-header">
                <div className="checkin-icon-wrapper">
                  <item.icon size={14} color={item.color} />
                </div>
                <span className="checkin-label">{item.label}</span>
              </div>

              <div className="checkin-ring-container">
                <svg className="checkin-ring-svg" viewBox="0 0 100 50">
                  {/* Background half-circle */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="var(--surface2)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Progress half-circle */}
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="125.6"
                    strokeDashoffset={125.6 - (125.6 * progress) / 100}
                    style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                  />
                </svg>
                <div className="checkin-value-display">
                  <span className="checkin-current">{item.current}/{item.total}</span>
                  <span className="checkin-unit">{item.unit}</span>
                </div>
              </div>

              <div className="checkin-controls">
                <button className="checkin-btn minus" onClick={() => handleUpdate(item.id, -1)}>
                  <Minus size={14} />
                </button>
                <div className="checkin-btn-divider"></div>
                <button className="checkin-btn plus" onClick={() => handleUpdate(item.id, 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}