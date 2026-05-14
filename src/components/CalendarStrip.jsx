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
  progressValue = 0.89, // 0.0 to 1.0
}) {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const isHomeDesktop = variant === 'home-desktop' && isDesktop;

  const [isExpanded, setIsExpanded] = useState(isHomeDesktop);
  const [baseDate, setBaseDate] = useState(() => {
    if (isHomeDesktop) return new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
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
      if (instant) strip2.scrollLeft = target;
      else strip2.scrollTo({ left: target, behavior: 'smooth' });
    }, instant ? 0 : 50);
  }, []);

  useEffect(() => { if (!isExpanded) scrollToDate(TODAY_STR, true); }, [scrollToDate, isExpanded]);
  useEffect(() => { if (!isExpanded) scrollToDate(normSelectedStr, false); }, [normSelectedStr, isExpanded, scrollToDate]);

  const handleStripAnimationComplete = useCallback(() => {
    scrollToDate(normSelectedStr, true);
  }, [normSelectedStr, scrollToDate]);

  const handleToggleExpand = () => {
    if (isHomeDesktop) return;
    if (!isExpanded) setBaseDate(new Date(normSelected.getFullYear(), normSelected.getMonth(), 1));
    setIsExpanded(prev => !prev);
  };

  const handlePrev = () => {
    if (isExpanded) setBaseDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() - 1); return d; });
    else stripRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (isExpanded) setBaseDate(prev => { const d = new Date(prev); d.setMonth(d.getMonth() + 1); return d; });
    else stripRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const monthLabel = baseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const headerLabel = isExpanded
    ? monthLabel
    : normSelected.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const firstDayOfWeek = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0).getDate();

  // Ring dimensions
  const SIZE = 48;
  const CX = SIZE / 2;         // 24
  const STROKE = 3;
  const R_OUTER = CX - STROKE; // 21  ← progress ring radius
  const R_INNER = R_OUTER - STROKE - 1; // 17 ← filled bg circle
  const CIRC = 2 * Math.PI * R_OUTER;

  return (
    <div
      className={['cs-wrap', isExpanded ? 'cs-expanded' : '', hideHeader ? 'cs-no-header' : '', `v-${variant}`]
        .filter(Boolean).join(' ')}
    >
      <GrainOverlay opacity={0.20} />

      {!hideHeader && (
        <div className="cs-header">
          <button className="cs-nav-btn" onClick={handlePrev}><ChevronLeft size={15} /></button>
          <button className="cs-header-label" onClick={handleToggleExpand}>
            {headerLabel}
            {!isHomeDesktop && <span className={`cs-chevron ${isExpanded ? 'open' : ''}`}>›</span>}
          </button>
          <button className="cs-nav-btn" onClick={handleNext}><ChevronRight size={15} /></button>
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
              const isToday = day.isToday;
              const showRing = isSelected || isToday;

              // clamp progress between 0 and 1
              const prog = Math.min(1, Math.max(0, progressValue));
              const arcLen = CIRC * prog;

              const cls = [
                'cs-day',
                isSelected ? 'selected' : '',
                isToday ? 'today' : '',
                day.isPast && !isSelected && !isToday ? 'past' : '',
                day.isWeekend && !isSelected && !isToday ? 'weekend' : '',
              ].filter(Boolean).join(' ');

              return (
                <div key={idx} className={cls} onClick={() => onDateSelect?.(day.fullDate)}>
                  <span className="cs-day-name">{day.label}</span>

                  <div className="cs-circle-wrap">
                    {showRing ? (
                      <svg
                        width={SIZE}
                        height={SIZE}
                        viewBox={`0 0 ${SIZE} ${SIZE}`}
                        className="cs-ring-svg"
                        style={{ display: 'block' }}
                      >
                        {/* filled background circle */}
                        <circle
                          cx={CX} cy={CX} r={R_INNER}
                          fill={isSelected ? '#c4fb31' : 'rgba(196,251,49,0.08)'}
                        />

                        {/* track ring — full circle, always visible */}
                        <circle
                          cx={CX} cy={CX} r={R_OUTER}
                          fill="none"
                          stroke={isSelected ? 'rgba(0,0,0,0.18)' : 'rgba(196,251,49,0.22)'}
                          strokeWidth={STROKE}
                        />

                        {/* progress arc on top of track */}
                        <circle
                          cx={CX} cy={CX} r={R_OUTER}
                          fill="none"
                          stroke={isSelected ? 'rgba(0,0,0,0.72)' : '#c4fb31'}
                          strokeWidth={STROKE}
                          strokeLinecap="round"
                          strokeDasharray={`${arcLen} ${CIRC}`}
                          transform={`rotate(-90 ${CX} ${CX})`}
                          style={{ transition: 'stroke-dasharray 0.5s ease' }}
                        />

                        {/* date number as SVG text — perfectly centered */}
                        <text
                          x={CX}
                          y={CX}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={isSelected ? '#000' : '#fff'}
                          fontSize="15"
                          fontWeight="800"
                          fontFamily="inherit"
                        >
                          {day.date}
                        </text>

                        {/* today dot */}
                        {isToday && (
                          <circle
                            cx={CX}
                            cy={CX + R_INNER - 5}
                            r={2}
                            fill={isSelected ? '#000' : '#c4fb31'}
                          />
                        )}
                      </svg>
                    ) : (
                      /* plain number for non-selected, non-today dates */
                      <div className="cs-plain-num">{day.date}</div>
                    )}
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
                <motion.span key={d} className="cs-month-label"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.15 }}>
                  {d}
                </motion.span>
              ))}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const cellDate = zeroTime(new Date(baseDate.getFullYear(), baseDate.getMonth(), i + 1));
                const cellStr = cellDate.toDateString();
                const isSel = cellStr === normSelectedStr;
                const isTod = cellStr === TODAY_STR;
                const cls = ['cs-month-cell', isSel ? 'selected' : '', isTod && !isSel ? 'today' : ''].filter(Boolean).join(' ');
                return (
                  <motion.div key={i} className={cls}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22, delay: 0.1 + i * 0.012, ease: [0.34, 1.56, 0.64, 1] }}
                    onClick={() => onDateSelect?.(new Date(cellDate))}>
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