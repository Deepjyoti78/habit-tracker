import { motion } from 'framer-motion';
import './OverallProgressCard.css';

export default function OverallProgressCard() {
  const progress = 89;
  
  return (
    <motion.div className="overall-progress-card-simple" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="opc-body-simple">
        <div className="opc-gauge-container-small">
          <svg width="60" height="60" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e3365b" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fcd34d" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="url(#gaugeGrad)" 
              strokeWidth="14" 
              strokeLinecap="round" 
              strokeDasharray="263.89" 
              strokeDashoffset={263.89 - (263.89 * progress) / 100}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="opc-gauge-value">{progress}%</div>
        </div>
        <div className="opc-text-container">
          <span className="opc-label-large">Completed</span>
          <span className="opc-sublabel">22/72 task</span>
        </div>
      </div>
    </motion.div>
  );
}
