import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import './NewDsaSessionModal.css';

export default function NewDsaSessionModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    questionTitle: '',
    topic: '',
    difficulty: 'Medium',
    status: 'In Progress',
    leetcodeLink: '',
    solutionLink: '',
    image: '',
    estimatedTime: '45m',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: `ds-${Date.now()}`,
      timeSpent: '0m',
      startedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastWorked: 'Just now',
      checklist: [],
      mistakes: [],
      timeline: [{ id: `t-${Date.now()}`, date: 'Today', text: 'Started session.' }],
      attempts: 0,
      completionDate: null,
    });
  };

  return (
    <div className="ds-modal-overlay">
      <motion.div 
        className="ds-modal-content"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="ds-modal-header">
          <h2>New Work Session</h2>
          <button className="ds-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form className="ds-modal-body" onSubmit={handleSubmit}>
          <div className="ds-form-row">
            <div className="ds-form-group flex-2">
              <label>Question Title</label>
              <input required name="questionTitle" value={formData.questionTitle} onChange={handleChange} placeholder="e.g. Reverse Pairs" />
            </div>
            <div className="ds-form-group flex-1">
              <label>Topic</label>
              <input required name="topic" value={formData.topic} onChange={handleChange} placeholder="e.g. Arrays" />
            </div>
          </div>

          <div className="ds-form-row">
            <div className="ds-form-group">
              <label>Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="ds-form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
            <div className="ds-form-group">
              <label>Est. Time</label>
              <input name="estimatedTime" value={formData.estimatedTime} onChange={handleChange} placeholder="e.g. 45m" />
            </div>
          </div>

          <div className="ds-form-group">
            <label>Question Link (LeetCode, etc.)</label>
            <input type="url" name="leetcodeLink" value={formData.leetcodeLink} onChange={handleChange} placeholder="https://" />
          </div>

          <div className="ds-form-group">
            <label>Solution Link (Optional)</label>
            <input type="url" name="solutionLink" value={formData.solutionLink} onChange={handleChange} placeholder="https://" />
          </div>

          <div className="ds-form-group">
            <label>Screenshot URL (Optional)</label>
            <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://" />
          </div>

          <div className="ds-form-group">
            <label>Initial Notes (Optional)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="What approach will you take?" rows={3} />
          </div>

          <div className="ds-modal-footer">
            <button type="button" className="ds-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="ds-btn-primary">Save Session</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
