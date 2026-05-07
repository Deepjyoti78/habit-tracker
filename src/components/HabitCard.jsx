import { Check, Flame, Plus, Activity, BookOpen, Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GrainOverlay from './GrainOverlay';
import './HabitCard.css';

export default function HabitCard() {
  const { state, dispatch } = useApp();
  const coreHabits = state.habits.filter(h => h.is_core || h.done !== undefined).slice(0, 1); // Reduced to 1 for height

  const toggleHabit = (id) => {
    dispatch({ type: 'TOGGLE_HABIT', payload: id });
  };

  return (
    <div className="nebula-card nebula-teal habit-card-nebula">
      <GrainOverlay opacity={0.15} />
      
      <div className="habit-nebula-header">
        <h3 className="habit-title">core disciplines</h3>
        <p className="habit-subtitle">your habits dashboard.<br/>start here!</p>
      </div>

      <div className="habit-nebula-content">
        <div className="habit-nebula-main-action">
          {coreHabits.map(habit => (
            <div
              key={habit.id}
              className={`habit-nebula-btn ${habit.done ? 'done' : ''}`}
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="habit-nebula-icon-box" style={{ backgroundColor: `${habit.color}22`, color: habit.color }}>
                {habit.done ? <Check size={20} /> : <Flame size={20} />}
              </div>
            </div>
          ))}
          
          <button className="habit-nebula-add-btn" onClick={() => dispatch({ type: 'SET_PAGE', payload: 'add-habit' })}>
            <Plus size={24} />
          </button>
        </div>

        {/* ── DECORATIVE FLOATING ICONS ── */}
        <div className="habit-nebula-deco">
          <div className="deco-icon d1"><Activity size={24} /></div>
          <div className="deco-icon d2"><BookOpen size={24} /></div>
          <div className="deco-icon d3"><Droplets size={24} /></div>
        </div>
      </div>
    </div>
  );
}