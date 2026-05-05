import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import './CalendarStrip.css';

export default function CalendarStrip({ hideHeader = false, selectedDate = new Date(), onDateSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [baseDate, setBaseDate] = useState(selectedDate);
  const scrollRef = React.useRef(null);

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

  // Generate 180 days for horizontal scrolling
  const days = Array.from({ length: 180 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 30 + i);
    const isSelected = d.toDateString() === selectedDate.toDateString();
    const isPast = d < today && d.toDateString() !== today.toDateString();

    let status = 'upcoming';
    if (isSelected) status = 'active';
    else if (isPast) status = 'partial';

    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(),
      date: d.getDate().toString().padStart(2, '0'),
      status,
      icon: isSelected ? Flame : null,
      fullDate: d
    };
  });

  const monthLabel = baseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Scroll to selected on mount or when changed
  useEffect(() => {
    if (!isExpanded) {
      const activeEl = document.querySelector('.calendar-day-col.active-day');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedDate, isExpanded]);

  return (
    <div className={`calendar-strip-card ${isExpanded ? 'expanded' : ''} ${hideHeader ? 'compact-no-header' : ''}`}>
      {!hideHeader && (
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
      )}

      {!isExpanded ? (
        <div className="calendar-days-row-scrollable" ref={scrollRef}>
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`calendar-day-col ${day.status === 'active' ? 'active-day' : ''}`}
              onClick={() => onDateSelect && onDateSelect(day.fullDate)}
            >
              <span className="calendar-day-label">{day.label}</span>
              <div className="calendar-day-circle">
                {day.status === 'active' ? (
                  <span className="active-date">{day.date}</span>
                ) : day.status === 'partial' ? (
                  <div className="h-cal-ring-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                      <circle 
                        cx="16" cy="16" r="14" fill="none" stroke="#f97316" strokeWidth="2" 
                        strokeDasharray="87.9" strokeDashoffset="20" transform="rotate(-90 16 16)" 
                      />
                    </svg>
                    <span className="upcoming-date" style={{ position: 'absolute' }}>{day.date}</span>
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
            {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="month-grid-header">{d}</span>)}
            {Array.from({length: 31}).map((_, i) => {
              const cellDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), i + 1);
              const isSelected = cellDate.toDateString() === selectedDate.toDateString();
              const isToday = cellDate.toDateString() === today.toDateString();
              
              return (
                <div 
                  key={i} 
                  className={`month-grid-cell ${isSelected ? 'active-today' : ''} ${isToday ? 'is-today-marker' : ''}`}
                  onClick={() => {
                    onDateSelect && onDateSelect(cellDate);
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
