import React, { useState } from 'react';
import { Check, Flame } from 'lucide-react';
import './HabitCard.css';

export default function HabitCard({ compact }) {
  const [habits, setHabits] = useState([
    { id: 1, text: 'Communication', streak: 5, done: true, color: '#a881ff' },
    { id: 2, text: 'Swimming', streak: 2, done: false, color: '#3b82f6' },
    { id: 3, text: 'No Junk Food', streak: 12, done: true, color: '#e8b835' },
    { id: 4, text: 'Clean', streak: 0, done: false, color: '#1db890' },
    { id: 5, text: 'Face Exercise', streak: 3, done: true, color: '#ff6b6b' },
  ]);

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  return (
    <div className="habit-card">
      <div className="habit-card-header">
        <h3 className="habit-title">Core Disciplines</h3>
      </div>

      <div className="habit-scroll-container">
        <div className="habit-list-clean">
          {habits.map(habit => (
            <div key={habit.id} className={`habit-row ${habit.done ? 'done' : ''}`} onClick={() => toggleHabit(habit.id)}>
              <div className="habit-info-left">
                <div className="habit-color-dot" style={{ backgroundColor: habit.color }}></div>
                <span
                  className="habit-text"
                  style={habit.done ? { textDecoration: 'line-through', textDecorationColor: habit.color, textDecorationThickness: '2px', color: 'rgba(255,255,255,0.4)' } : {}}
                >
                  {habit.text}
                </span>
              </div>

              <div className="habit-info-right">
                <button
                  className="habit-checkbox-right"
                  style={{
                    borderColor: habit.done ? habit.color : 'var(--border)',
                    backgroundColor: habit.done ? habit.color : 'transparent'
                  }}
                >
                  {habit.done && <Check size={14} color="#000" strokeWidth={3} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
