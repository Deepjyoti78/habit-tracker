import React from 'react';
import { motion } from 'framer-motion';
import './HabitProgressCard.css';

export default function HabitProgressCard({ habit, index }) {
  const color = habit.color || '#c4fb31';
  const emoji = habit.emoji || '';
  const name = habit.name || habit.title || 'habit';

  // Prevent duplicate text-based emojis
  const showEmoji = emoji && emoji.toLowerCase() !== name.toLowerCase() && emoji.trim().length <= 2;

  // Heatmap calculation parameters
  const WEEKS = 52;
  const DAYS = 7;
  const total = WEEKS * DAYS;

  // Generate mini heatmap cells (real logs or premium mock completions)
  const cells = Array.from({ length: total }, (_, i) => {
    if (!habit.logs || habit.logs.length === 0) {
      // Deterministic preview seed based on habit ID
      const seed = (habit.id?.charCodeAt?.(0) || index + 1) * (i + 1);
      const rand = ((seed * 1664525 + 1013904223) & 0xffffffff) / 0xffffffff;
      if (rand > 0.68) return Math.random() > 0.5 ? 2 : 3;
      if (rand > 0.48) return 1;
      return 0;
    }
    const cellDate = new Date();
    cellDate.setDate(cellDate.getDate() - (total - 1 - i));
    const dateStr = cellDate.toDateString();
    const logged = habit.logs?.some(log => {
      const d = new Date(log.date || log.timestamp || log);
      return d.toDateString() === dateStr;
    });
    return logged ? 3 : 0;
  });

  const getOpacity = (val) => {
    if (val === 0) return 'rgba(255,255,255,0.03)';
    if (val === 1) return `${color}33`;
    if (val === 2) return `${color}73`;
    return color;
  };

  const dayLabels = ['', 'm', '', 'w', '', 'f', ''];

  return (
    <motion.div
      className="habit-progress-nebula"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
    >
      <div className="hpc-nebula-content only-heatmap">
        {/* Header: Name, Emoji & Period */}
        <div className="hpc-header">
          <div className="hpc-header-left">
            {showEmoji && <span className="hpc-emoji">{emoji}</span>}
            <span className="hpc-name">{name}</span>
          </div>
          <span className="hpc-period">last 52 weeks</span>
        </div>

        {/* Heatmap with day labels rendered in columns */}
        <div className="hpc-heatmap-container">
          <div className="hpc-heatmap-day-labels">
            {dayLabels.map((d, i) => (
              <span key={i} className="hpc-heatmap-day-label">
                {d}
              </span>
            ))}
          </div>

          <div className="hpc-heatmap-section">
            <div className="hpc-heatmap-grid">
              {Array.from({ length: WEEKS }, (_, col) => (
                <div key={col} className="hpc-heatmap-col">
                  {Array.from({ length: DAYS }, (_, row) => {
                    const cellIdx = col * DAYS + row;
                    const val = cells[cellIdx] || 0;
                    return (
                      <div
                        key={row}
                        className="hpc-heatmap-cell"
                        style={{ background: getOpacity(val) }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="hpc-heatmap-footer">
          <span className="hpc-legend-label">less</span>
          <div className="hpc-legend-cells">
            {[0, 1, 2, 3].map((val) => (
              <div
                key={val}
                className="hpc-legend-cell"
                style={{ background: getOpacity(val) }}
              />
            ))}
          </div>
          <span className="hpc-legend-label">more</span>
        </div>
      </div>
    </motion.div>
  );
}
