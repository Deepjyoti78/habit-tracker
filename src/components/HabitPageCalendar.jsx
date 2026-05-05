import React from 'react';
import { motion } from 'framer-motion';
import './HabitPageCalendar.css';

export default function HabitPageCalendar() {
  const scrollRef = React.useRef(null);
  const today = new Date();
  
  // Generate days (30 days past to 60 days future)
  const days = Array.from({ length: 90 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 15 + i);
    const isToday = d.toDateString() === today.toDateString();
    
    // Mock completion percentage for the rings
    let completion = 0;
    if (d < today) completion = Math.random() > 0.3 ? 100 : 40;
    
    return {
      fullDate: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(),
      dateNum: d.getDate(),
      isToday,
      completion
    };
  });

  React.useEffect(() => {
    const activeEl = document.querySelector('.h-cal-day.active');
    if (activeEl && scrollRef.current) {
      activeEl.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    }
  }, []);

  return (
    <div className="habit-calendar-scroll-container" ref={scrollRef}>
      {days.map((day, idx) => (
        <div key={idx} className={`h-cal-day ${day.isToday ? 'active' : ''}`}>
          <span className="h-cal-name">{day.dayName}</span>
          <div className="h-cal-date-container">
            {day.isToday ? (
              <div className="h-cal-today-circle">
                {day.dateNum}
              </div>
            ) : (
              <div className="h-cal-ring-wrapper">
                <svg width="32" height="32" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                  {day.completion > 0 && (
                    <circle 
                      cx="16" cy="16" r="14" fill="none" 
                      stroke={day.completion === 100 ? '#f97316' : '#f9731680'} 
                      strokeWidth="2" 
                      strokeDasharray="87.9"
                      strokeDashoffset={87.9 - (87.9 * day.completion) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 16 16)"
                    />
                  )}
                </svg>
                <span className="h-cal-date-num-ring">{day.dateNum}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
