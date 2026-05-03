import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { plannerItems } from '../data/appData';
import { Plus } from 'lucide-react';
import './PlannerCard.css';

export default function PlannerCard({ compact = false }) {
  const { dispatch } = useApp();
  const items = compact ? plannerItems.slice(0, 4) : plannerItems;
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  const handleFocusTask = (text) => {
    dispatch({ type: 'SHOW_TOAST', payload: `focusing on: ${text}` });
  };

  const formatTimeInfo = (timeStr) => {
    const [h, m] = timeStr.split(':');
    const hourNum = parseInt(h);
    const ampm = hourNum >= 12 ? 'pm' : 'am';
    
    let standardHour = hourNum % 12;
    if (standardHour === 0) standardHour = 12;
    const formattedHourStr = standardHour.toString().padStart(2, '0');

    return { 
      h: formattedHourStr, 
      m, 
      ampm,
      fullTimeStr: `${formattedHourStr}:${m} ${ampm}`
    };
  };

  // For the left column we want a short Day string and Date string.
  // Since our items are just times, we can show a mock day/date sequence or just the time parts.
  // Let's use the time hour and minute to look like the design, OR we can show the day abbreviation and date.
  // The user wanted "Today's Plan", so showing different dates doesn't make sense.
  // We'll show the hour on top, minute below it to mimic the look.
  
  return (
    <motion.div
      className="planner-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="card-header">
        <span className="card-title">{monthName}</span>
        <button
          className="card-action add-btn"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'planner' })}
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="planner-list">
        {items.map((item, i) => {
          const { h, m, ampm, fullTimeStr } = formatTimeInfo(item.time);
          
          return (
            <motion.div
              key={item.id}
              className={`planner-item ${item.status === 'active' || item.status === 'upcoming' && i % 2 !== 0 ? 'is-active' : ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              whileHover={{ x: 3, transition: { duration: 0.15 } }}
              onClick={() => handleFocusTask(item.text)}
            >
              <div className="planner-time-col">
                <span className="planner-time-hr">{h}</span>
                <span className="planner-time-min">{m}</span>
              </div>
              
              <div className="planner-pill">
                <span className="planner-pill-title">{item.text}</span>
                <span className="planner-pill-time">{fullTimeStr}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {compact && plannerItems.length > 4 && (
        <button
          className="planner-show-all"
          onClick={() => dispatch({ type: 'SET_PAGE', payload: 'planner' })}
        >
          view full schedule →
        </button>
      )}
    </motion.div>
  );
}
