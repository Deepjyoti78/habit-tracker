import API from './axios';

export const getHeatmap = () => API.get('/analytics/heatmap');
export const getWeeklyStats = () => API.get('/analytics/weekly');
export const logMood = (data) => API.post('/analytics/mood', data);
export const getMoodLogs = () => API.get('/analytics/mood');