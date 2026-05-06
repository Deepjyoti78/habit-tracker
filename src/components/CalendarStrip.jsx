import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CalendarStrip.css';

export default function CalendarStrip({ hideHeader = false, selectedDate = new Date(), onDateSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [baseDate, setBaseDate] = useState(new Date());
  const scrollRef = useRef(null);
  const today = new Date();

  const days = Array.from({ length: 180 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 30 + i);
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(),
      date: d.getDate().toString().padStart(2, '0'),
      isToday: d.toDateString() === today.toDateString(),
      isSelected: d.toDateString() === selectedDate.toDateString(),
      isPast: d < today && d.toDateString() !== today.toDateString(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      fullDate: d,
    };
  });

  useEffect(() => {
    if (!isExpanded) {
      setTimeout(() => {
        const el = scrollRef.current?.querySelector('.cs-day.selected');
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }, 100);
    }
  }, [selectedDate, isExpanded]);

  const monthLabel = baseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Build full month grid
  const firstDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();

  return (
    <div className={`cs-wrap ${isExpanded ? 'cs-expanded' : ''} ${hideHeader ? 'cs-no-header' : ''}`}>
      {!hideHeader && (
        <div className="cs-header">
          <button className="cs-nav-btn" onClick={() => {
            if (isExpanded) {
              const d = new Date(baseDate);
              d.setMonth(d.getMonth() - 1);
              setBaseDate(d);
            } else {
              scrollRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
            }
          }}>
            <ChevronLeft size={15} />
          </button>
          <span className="cs-header-label" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? monthLabel : `today, ${today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
          </span>
          <button className="cs-nav-btn" onClick={() => {
            if (isExpanded) {
              const d = new Date(baseDate);
              d.setMonth(d.getMonth() + 1);
              setBaseDate(d);
            } else {
              scrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' });
            }
          }}>
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {!isExpanded ? (
        <div className="cs-strip" ref={scrollRef}>
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`cs-day ${day.isSelected ? 'selected' : ''} ${day.isToday && !day.isSelected ? 'today' : ''} ${day.isPast && !day.isSelected ? 'past' : ''} ${day.isWeekend && !day.isSelected ? 'weekend' : ''}`}
              onClick={() => onDateSelect?.(day.fullDate)}
            >
              <span className="cs-day-name">{day.label.slice(0, 3)}</span>
              <div className="cs-day-num-wrap">
                <span className="cs-day-num">{day.date}</span>
                {day.isToday && !day.isSelected && <div className="cs-today-dot" />}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cs-month-grid">
          {['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'].map(d => (
            <span key={d} className="cs-month-label">{d}</span>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const cellDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), i + 1);
            const isSel = cellDate.toDateString() === selectedDate.toDateString();
            const isTod = cellDate.toDateString() === today.toDateString();
            return (
              <div
                key={i}
                className={`cs-month-cell ${isSel ? 'selected' : ''} ${isTod && !isSel ? 'today' : ''}`}
                onClick={() => { onDateSelect?.(cellDate); setIsExpanded(false); }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}