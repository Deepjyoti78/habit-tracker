import { motion } from 'framer-motion';
import { aiInsights } from '../data/appData';
import './AIInsights.css';

const typeClasses = {
  warning: 'warn',
  success: 'good',
  info: 'info',
  tip: 'tip',
};

export default function AIInsights() {
  return (
    <motion.div
      className="ai-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
    >
      <div className="ai-header">
        <div className="ai-dot-wrap">
          <div className="ai-dot" />
          <div className="ai-dot-ring" />
        </div>
        <span className="ai-title">AI Insights</span>
        <span className="ai-beta">LIVE</span>
      </div>

      <div className="ai-insights-list">
        {aiInsights.map((insight, i) => (
          <motion.div
            key={insight.id}
            className="ai-insight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            whileHover={{ x: 3, transition: { duration: 0.15 } }}
          >
            <div className={`ai-insight-icon ${typeClasses[insight.type]}`}>
              {insight.icon}
            </div>
            <div
              className="ai-insight-text"
              dangerouslySetInnerHTML={{ __html: insight.text }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
