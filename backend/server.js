import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import habitsRoutes from './routes/habits.js';
import tasksRoutes from './routes/tasks.js';
import checkinsRoutes from './routes/checkins.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://habit-tracker-1-wa6g.onrender.com',
  'https://habit-tracker-phi-sepia.vercel.app',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/checkins', checkinsRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api', (req, res) => res.json({ message: 'discipline-os API running 🚀' }));
app.get('/', (req, res) => res.json({ message: 'discipline-os API running 🚀' }));

// Only listen if not running in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
  });
}

export default app;
