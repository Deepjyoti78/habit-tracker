const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allowed origins: local dev + all deployed frontends
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://habit-tracker-1-wa6g.onrender.com',
  'https://habit-tracker-phi-sepia.vercel.app',
  // Add any extra origin from env (e.g. custom domain)
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Instead of throwing an error, allow the request but it will fail CORS
    // or just return false so cors doesn't set the header
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Handle preflight for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/checkins', require('./routes/checkins'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/', (req, res) => res.json({ message: 'discipline-os API running 🚀' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});
