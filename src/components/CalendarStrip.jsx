import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import './CalendarStrip.css';

export default function CalendarStrip() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [baseDate, setBaseDate] = useState(new Date());
  const [clickedDays, setClickedDays] = useState({});
  const scrollRef = React.useRef(null);

  const toggleDayDisplay = (dateStr) => {
    setClickedDays(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  const handlePrevClick = (e) => {
    e.stopPropagation();
    if (isExpanded) {
      const newDate = new Date(baseDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setBaseDate(newDate);
    } else {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -250, behavior: 'smooth' });
      }
    }
  };

  const handleNextClick = (e) => {
    e.stopPropagation();
    if (isExpanded) {
      const newDate = new Date(baseDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setBaseDate(newDate);
    } else {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 250, behavior: 'smooth' });
      }
    }
  };

  const today = new Date();
  
  // Generate 180 days for horizontal scrolling (from 30 days ago to 150 days future)
  const days = Array.from({ length: 180 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 30 + i);
    const isToday = d.toDateString() === today.toDateString();
    const isPast = d < today && !isToday;
    
    let status = 'upcoming';
    if (isToday) status = 'active';
    else if (isPast) status = 'partial';

    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3),
      date: d.getDate().toString().padStart(2, '0'),
      status,
      icon: isToday ? Flame : null,
      fullDate: d
    };
  });

  // Mock month data for expanded view based on baseDate
  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).getDay();
  
  const monthDays = Array.from({ length: daysInMonth }).map((_, i) => {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth(), i + 1);
    const isPast = date < today && date.toDateString() !== today.toDateString();
    const isToday = date.toDateString() === today.toDateString();
    
    let completion = 0;
    if (isPast) {
      // Mock progression: earlier days in the month have higher completion
      completion = Math.floor(Math.random() * 80) + 20; 
      // If it's more than 20 days ago, make it 100% mostly
      if (today.getDate() - (i + 1) > 10) completion = 100;
    }
    
    return { date: i + 1, status: isPast ? 'past' : 'upcoming', completion, isToday };
  });

  const monthLabel = baseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Scroll to today on mount instantly
  useEffect(() => {
    if (!isExpanded) {
      const activeEl = document.querySelector('.calendar-day-col.active-day');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
      }
    }
  }, [isExpanded]);

  return (
    <div className={`calendar-strip-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="calendar-strip-header">
        <button className="calendar-nav-btn" onClick={handlePrevClick}><ChevronLeft size={16} /></button>
        <div 
          className="calendar-date-text" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? monthLabel : `Today, ${today.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}`}
        </div>
        <button className="calendar-nav-btn" onClick={handleNextClick}><ChevronRight size={16} /></button>
      </div>

      {!isExpanded ? (
        <div className="calendar-days-row-scrollable" ref={scrollRef}>
          {days.map((day, i) => (
            <div key={i} className={`calendar-day-col ${day.status === 'active' ? 'active-day' : ''}`}>
              <span className="calendar-day-label">{day.label}</span>
              <div className="calendar-day-circle">
                {day.status === 'active' && day.icon ? (
                  <day.icon size={18} color="var(--bg)" fill="currentColor" />
                ) : day.status === 'partial' ? (
                  <div 
                    className="partial-day-wrapper" 
                    onClick={() => toggleDayDisplay(day.fullDate.toDateString())}
                    style={{ position: 'relative', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" style={{position: 'absolute', transform: 'rotate(-90deg)'}}>
                      <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                      <circle cx="14" cy="14" r="12" fill="none" stroke="#d94a26" strokeWidth="2" strokeDasharray="75.39" strokeDashoffset={75.39 * 0.25} strokeLinecap="round" />
                    </svg>
                    <span style={{ fontSize: '10px', color: 'var(--text2)', fontWeight: '700', zIndex: 1, letterSpacing: '-0.5px' }}>
                      {clickedDays[day.fullDate.toDateString()] ? '75%' : day.date}
                    </span>
                  </div>
                ) : (
                  <span className="upcoming-date">{day.date}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="calendar-month-view">
          <div className="month-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="month-grid-header">{d}</div>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="month-grid-cell empty"></div>
            ))}
            {monthDays.map((day, i) => {
              let circleStyle = {};
              if (day.status === 'past') {
                const scale = 0.5 + (day.completion / 100) * 0.7; // 0.5 to 1.2 (overlaps slightly if 100%)
                let color = 'var(--red)'; // default bad
                if (day.completion >= 40 && day.completion < 80) color = 'var(--amber)';
                if (day.completion >= 80) color = '#1db890'; // Use a nice teal/green like google fit

                circleStyle = {
                  width: `${scale * 100}%`,
                  height: `${scale * 100}%`,
                  borderRadius: '50%',
                  background: color, // Solid filled circle
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: day.completion > 0 ? 0.9 : 0
                };
              }

              return (
                <div key={i} className={`month-grid-cell ${day.status} ${day.isToday ? 'active-today' : ''}`} style={{ position: 'relative' }}>
                  {day.status === 'past' && <div style={circleStyle} />}
                  <span style={{ zIndex: 1, position: 'relative', color: day.status === 'past' && day.completion >= 80 ? '#fff' : '' }}>
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
