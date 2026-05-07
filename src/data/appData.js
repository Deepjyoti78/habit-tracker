export const defaultHabits = [
  {
    id: 'h1',
    name: 'Academic',
    emoji: '📚',
    category: 'skills',
    target: '6 sessions',
    currentValue: 2,
    targetValue: 6,
    progress: 33,
    unit: 'sessions',
    color: '#3b82f6',
    streak: 0,
    done: false,
    trackingType: 'study',
  },
  {
    id: 'h2',
    name: 'Sleep',
    emoji: '🌙',
    category: 'health',
    target: '8 hours',
    currentValue: 6,
    targetValue: 8,
    progress: 75,
    unit: 'hours',
    color: '#8b5cf6',
    streak: 0,
    done: false,
    trackingType: 'sleep',
  },
  {
    id: 'h3',
    name: 'Coding',
    emoji: '💻',
    category: 'skills',
    target: '4 hours',
    currentValue: 1,
    targetValue: 4,
    progress: 25,
    unit: 'hours',
    color: '#10b981',
    streak: 0,
    done: false,
    trackingType: 'study',
  },
  {
    id: 'h4',
    name: 'Communication',
    emoji: '🗣️',
    category: 'skills',
    target: '3 sessions',
    currentValue: 1,
    targetValue: 3,
    progress: 33,
    unit: 'sessions',
    color: '#f97316',
    streak: 0,
    done: false,
    trackingType: 'study',
  },
  {
    id: 'h5',
    name: 'Mind',
    emoji: '🧠',
    category: 'mindfulness',
    target: '20 mins',
    currentValue: 10,
    targetValue: 20,
    progress: 50,
    unit: 'mins',
    color: '#ec4899',
    streak: 0,
    done: false,
    trackingType: 'mind',
  },
  {
    id: 'h6',
    name: 'Water',
    emoji: '💧',
    category: 'health',
    target: '8 glasses',
    currentValue: 4,
    targetValue: 8,
    progress: 50,
    unit: 'glasses',
    color: '#06b6d4',
    streak: 0,
    done: false,
    trackingType: 'water',
  },
];

export const plannerItems = [
  { id: 'p1', time: '06:00', text: 'Wake up + cold shower', category: 'health', status: 'done' },
  { id: 'p2', time: '06:30', text: 'Morning run — 5km target', category: 'fitness', status: 'done' },
  { id: 'p3', time: '08:00', text: 'Breakfast + journal reflection', category: 'health', status: 'done' },
  { id: 'p4', time: '09:00', text: 'Deep work — DSA problems (LeetCode)', category: 'work', status: 'active' },
  { id: 'p5', time: '12:00', text: 'Python assignment CIE-332T', category: 'work', status: 'upcoming' },
  { id: 'p6', time: '14:00', text: 'Lunch + power nap (20 min)', category: 'health', status: 'upcoming' },
  { id: 'p7', time: '15:00', text: 'System design study', category: 'work', status: 'upcoming' },
  { id: 'p8', time: '17:00', text: 'Swimming — kick technique drills', category: 'fitness', status: 'upcoming' },
  { id: 'p9', time: '19:00', text: 'Dinner + family time', category: 'personal', status: 'upcoming' },
  { id: 'p10', time: '21:00', text: 'Read + wind down — no screens', category: 'growth', status: 'upcoming' },
];

export const aiInsights = [
  { id: 'ai1', type: 'warning', icon: '⚠️', text: '<strong>You missed Gym 2 days in a row.</strong> Your streak is at risk. Today is the critical recovery window.' },
  { id: 'ai2', type: 'success', icon: '⚡', text: '<strong>You\'re most productive at 9 AM.</strong> Your task completion rate is 73% higher in the first 2 hours.' },
  { id: 'ai3', type: 'info', icon: '📊', text: '<strong>Weekly discipline score: 68%.</strong> You need 3 clean days to hit your 75% target.' },
  { id: 'ai4', type: 'tip', icon: '💡', text: '<strong>Pattern detected:</strong> You tend to skip evening habits on Tuesdays and Thursdays.' },
];

export const weeklyStats = { done: 12, missed: 5, streak: 7, score: 68, delta: 4, totalHabits: 24 };

export const analyticsData = {
  weeklyScores: [52, 61, 58, 72, 65, 68, 74],
  monthlyScores: [45, 52, 58, 55, 61, 64, 68, 72, 70, 75, 68, 74],
  categoryBreakdown: [
    { name: 'Fitness', score: 62, color: '#ef4444' },
    { name: 'Health', score: 85, color: '#22c55e' },
    { name: 'Growth', score: 71, color: '#6c63ff' },
    { name: 'Focus', score: 58, color: '#f59e0b' },
    { name: 'Mindfulness', score: 77, color: '#ec4899' },
  ],
  bestDay: 'Wednesday',
  worstDay: 'Saturday',
  bestTime: '9:00 AM',
  avgCompletionRate: 68,
};

export function generateHeatmapData() {
  const weeks = 52;
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (w === weeks - 1 && d >= new Date().getDay()) {
        week.push(0);
      } else {
        const r = Math.random();
        if (r > 0.82) week.push(4);
        else if (r > 0.6) week.push(3);
        else if (r > 0.35) week.push(2);
        else if (r > 0.15) week.push(1);
        else week.push(0);
      }
    }
    data.push(week);
  }
  return data;
}
