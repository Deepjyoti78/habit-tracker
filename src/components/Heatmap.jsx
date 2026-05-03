import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { generateHeatmapData } from '../data/appData';
import './Heatmap.css';

const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const levelColors = [
  'var(--surface3)',
  'rgba(108, 99, 255, 0.18)',
  'rgba(108, 99, 255, 0.38)',
  'rgba(108, 99, 255, 0.62)',
  'var(--accent)',
];

export default function Heatmap() {
  const data = useMemo(() => generateHeatmapData(), []);
  const [hoveredCell, setHoveredCell] = useState(null);

  return (
    <motion.div
      className="heatmap-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="card-header">
        <span className="card-title">progress</span>
        <span className="heatmap-period">last 52 weeks</span>
      </div>

      <div className="heatmap-container">
        {/* Day labels */}
        <div className="heatmap-day-labels">
          {dayLabels.map((d, i) => (
            <span key={i} className="heatmap-day-label">
              {i % 2 === 1 ? d : ''}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="heatmap-grid">
          {data.map((week, wi) => (
            <div key={wi} className="heatmap-col">
              {week.map((level, di) => (
                <motion.div
                  key={`${wi}-${di}`}
                  className="heatmap-cell"
                  style={{ background: levelColors[level] }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.1 + wi * 0.008 + di * 0.005,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.4, zIndex: 2 }}
                  onMouseEnter={() =>
                    setHoveredCell({
                      week: wi + 1,
                      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][di],
                      level,
                    })
                  }
                  onMouseLeave={() => setHoveredCell(null)}
                  title={`Week ${wi + 1}, ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][di]}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="heatmap-legend">
        <span className="heatmap-legend-text">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="heatmap-legend-cell"
            style={{ background: levelColors[level] }}
          />
        ))}
        <span className="heatmap-legend-text">More</span>

        {hoveredCell && (
          <span className="heatmap-tooltip">
            Week {hoveredCell.week} · {hoveredCell.day} ·{' '}
            {['None', 'Low', 'Medium', 'High', 'Perfect'][hoveredCell.level]}
          </span>
        )}
      </div>
    </motion.div>
  );
}
