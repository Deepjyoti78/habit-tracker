import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GrainOverlay from './GrainOverlay';
import './CalendarStrip.css';

function makeToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
const TODAY = makeToday();
const TODAY_STR = TODAY.toDateString();

function zeroTime(d) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

const TOTAL_DAYS = 365;
const CENTER_IDX = 182;

const ALL_DAYS = Array.from({ length: TOTAL_DAYS }).map((_, i) => {
  const d = new Date(TODAY);
  d.setDate(TODAY.getDate() - CENTER_IDX + i);
  d.setHours(0, 0, 0, 0);
  return {
    label: d.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(),
    date: d.getDate().toString().padStart(2, '0'),
    dateStr: d.toDateString(),
    isToday: d.toDateString() === TODAY_STR,
    isPast: d < TODAY && d.toDateString() !== TODAY_STR,
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
    fullDate: new Date(d),
  };
});

export default function CalendarStrip({
  hideHeader = false,
  selectedDate = new Date(),
  onDateSelect,
  variant = 'default',
}) {
  // Safely detect desktop — avoids SSR/mobile breaking
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const isHomeDesktop = variant === 'home-desktop' && isDesktop;

  const [isExpanded, setIsExpanded] = useState(isHomeDesktop);
  const [baseDate, setBaseDate] = useState(() => {
    if (isHomeDesktop) {
      return new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
    }
    return new Date(TODAY);
  });
  const stripRef = useRef(null);

  const normSelected = zeroTime(selectedDate);
  const normSelectedStr = normSelected.toDateString();

  const scrollToDate = useCallback((dateStr, instant = false) => {
    const strip = stripRef.current;
    if (!strip) return;
    const idx = ALL_DAYS.findIndex(d => d.dateStr === dateStr);
    if (idx === -1) return;
    setTimeout(() => {
      const strip2 = stripRef.current;
      if (!strip2) return;
      const child = strip2.children[idx];
      if (!child) return;
      const stripW = strip2.offsetWidth;
      const cellL = child.offsetLeft;
      const cellW = child.offsetWidth;
      const target = cellL - stripW / 2 + cellW / 2;
      if (instant) {
        strip2.scrollLeft = target;
      } else {
        strip2.scrollTo({ left: target, behavior: 'smooth' });
      }
    }, instant ? 0 : 50);
  }, []);

  useEffect(() => {
    if (!isExpanded) scrollToDate(TODAY_STR, true);
  }, [scrollToDate, isExpanded]);

  useEffect(() => {
    if (!isExpanded) scrollToDate(normSelectedStr, false);
  }, [normSelectedStr, isExpanded, scrollToDate]);

  const handleStripAnimationComplete = useCallback(() => {
    scrollToDate(normSelectedStr, true);
  }, [normSelectedStr, scrollToDate]);

  const handleToggleExpand = () => {
    // Desktop home variant: don't allow collapsing
    if (isHomeDesktop) return;
    if (!isExpanded) {
      setBaseDate(new Date(
        normSelected.getFullYear(),
        normSelected.getMonth(),
        1,
      ));
    }
    setIsExpanded(prev => !prev);
  };

  const handlePrev = () => {
    if (isExpanded) {
      setBaseDate(prev => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() - 1);
        return d;
      });
    } else {
      stripRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (isExpanded) {
      setBaseDate(prev => {
        const d = new Date(prev);
        d.setMonth(d.getMonth() + 1);
        return d;
      });
    } else {
      stripRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const monthLabel = baseDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const headerLabel = isExpanded
    ? monthLabel
    : normSelected.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  const firstDayOfWeek = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + 1,
    0
  ).getDate();

  return (
    <div
      className={[
        'cs-wrap',
        isExpanded ? 'cs-expanded' : '',
        hideHeader ? 'cs-no-header' : '',
        `v-${variant}`,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <GrainOverlay opacity={0.20} />

      {!hideHeader && (
        <div className="cs-header">
          <button className="cs-nav-btn" onClick={handlePrev}>
            <ChevronLeft size={15} />
          </button>
          <button className="cs-header-label" onClick={handleToggleExpand}>
            {headerLabel}
            {!isHomeDesktop && (
              <span className={`cs-chevron ${isExpanded ? 'open' : ''}`}>›</span>
            )}
          </button>
          <button className="cs-nav-btn" onClick={handleNext}>
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">

        {!isExpanded ? (
          <motion.div
            key="strip"
            className="cs-strip"
            ref={stripRef}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onAnimationComplete={handleStripAnimationComplete}
          >
            {ALL_DAYS.map((day, idx) => {
              const isSelected = day.dateStr === normSelectedStr;
              const cls = [
                'cs-day',
                isSelected ? 'selected' : '',
                day.isToday ? 'today' : '',
                day.isPast && !isSelected && !day.isToday ? 'past' : '',
                day.isWeekend && !isSelected && !day.isToday ? 'weekend' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={idx}
                  className={cls}
                  onClick={() => onDateSelect?.(day.fullDate)}
                >
                  <span className="cs-day-name">{day.label}</span>
                  <div className="cs-day-num-wrap">
                    <span className="cs-day-num">{day.date}</span>
                    {day.isToday && <div className="cs-today-dot" />}
                  </div>
                </div>
              );
            })}
          </motion.div>

        ) : (
          <motion.div
            key="grid"
            className="cs-month-grid"
            initial={{ opacity: 0, height: 0, scale: 0.97 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.97 }}
            transition={{
              height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.25, ease: 'easeOut' },
              scale: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
            }}
          >
            <div className="cs-month-inner-grid">
              {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map(d => (
                <motion.span
                  key={d}
                  className="cs-month-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.15 }}
                >
                  {d}
                </motion.span>
              ))}

              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`e-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const cellDate = zeroTime(
                  new Date(baseDate.getFullYear(), baseDate.getMonth(), i + 1)
                );
                const cellStr = cellDate.toDateString();
                const isSel = cellStr === normSelectedStr;
                const isTod = cellStr === TODAY_STR;
                const cls = [
                  'cs-month-cell',
                  isSel ? 'selected' : '',
                  isTod && !isSel ? 'today' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <motion.div
                    key={i}
                    className={cls}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.22,
                      delay: 0.1 + i * 0.012,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    onClick={() => {
                      onDateSelect?.(new Date(cellDate));
                      // Never collapse on date click — only collapse via header toggle
                    }}
                  >
                    {i + 1}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}