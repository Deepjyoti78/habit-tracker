import React from 'react';
import { Check, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './HabitCard.css';

export default function HabitCard() {
  const { state, dispatch } = useApp();
  const coreHabits = state.habits.filter(h => h.is_core || h.done !== undefined).slice(0, 5);

  const toggleHabit = (id) => {
    dispatch({ type: 'TOGGLE_HABIT', payload: id });
  };

  return (
    <div className="habit-card">
      <div className="habit-card-header">
        <h3 className="habit-title">core disciplines</h3>
      </div>
      <div className="habit-scroll-container">
        <div className="habit-list-clean">
          {coreHabits.length === 0 ? (
            <p style={{ color: '#444', fontSize: '12px', padding: '8px 4px' }}>
              no habits yet
            </p>
          ) : (
            coreHabits.map(habit => (
              <div
                key={habit.id}
                className={`habit-row ${habit.done ? 'done' : ''}`}
                onClick={() => toggleHabit(habit.id)}
              >
                <div className="habit-info-left">
                  <div
                    className="habit-color-dot"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span
                    className="habit-text"
                    style={habit.done ? {
                      textDecoration: 'line-through',
                      textDecorationColor: habit.color,
                      textDecorationThickness: '2px',
                      color: 'rgba(255,255,255,0.4)'
                    } : {}}
                  >
                    {habit.name || habit.text}
                  </span>
                </div>
                <div className="habit-info-right">
                  <div className="habit-minimal-streak">
                    <span>{habit.streak || 0}</span>
                    <Flame size={14} fill="#f97316" color="#f97316" />
                  </div>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}