import { Flame, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './TopBar.css';

export default function TopBar() {
  const { state, dispatch } = useApp();

  const now = new Date();
  const dateStr = now
    .toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    })
    .toUpperCase();

  const hour = now.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const handleStartDay = () => {
    dispatch({ type: 'START_DAY' });
    dispatch({ type: 'SHOW_TOAST', payload: "Day started — let's get after it 🚀" });
  };

  return (
    <header className="topbar" id="topbar">
      <div className="topbar-left">
        <span className="topbar-date">{dateStr}</span>
        <span className="topbar-greeting">{greeting}, Deep</span>
      </div>
      <div className="topbar-right">
        <div className="topbar-streak" id="streak-badge">
          <Flame size={13} />
          <span>{state.stats.streak}-day streak</span>
        </div>
        <button
          className="topbar-btn primary"
          onClick={handleStartDay}
          id="start-day-btn"
        >
          <Plus size={14} />
          Start Day
        </button>
      </div>
    </header>
  );
}
