-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_seed VARCHAR(50) DEFAULT 'deep',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habits table
CREATE TABLE IF NOT EXISTS habits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  category VARCHAR(50),
  target_value INTEGER DEFAULT 1,
  unit VARCHAR(30),
  color VARCHAR(20),
  frequency VARCHAR(20) DEFAULT 'daily',
  active_days TEXT[],
  reminder BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Habit logs (daily check-ins per habit)
CREATE TABLE IF NOT EXISTS habit_logs (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  current_value INTEGER DEFAULT 0,
  target_value INTEGER DEFAULT 1,
  progress INTEGER DEFAULT 0,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- Tasks / Planner
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  work_type VARCHAR(50),
  group_name VARCHAR(100),
  start_time VARCHAR(20),
  end_time VARCHAR(20),
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Daily checkins (water, sleep, meditate, reading)
CREATE TABLE IF NOT EXISTS daily_checkins (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  water_current INTEGER DEFAULT 0,
  water_target INTEGER DEFAULT 8,
  sleep_current FLOAT DEFAULT 0,
  sleep_target FLOAT DEFAULT 8,
  meditate_current INTEGER DEFAULT 0,
  meditate_target INTEGER DEFAULT 10,
  reading_current INTEGER DEFAULT 0,
  reading_target INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Mood logs (for analytics chart)
CREATE TABLE IF NOT EXISTS mood_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood_level INTEGER CHECK (mood_level BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);