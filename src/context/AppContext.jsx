import { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';
import { getHabits } from '../api/habits';
import { getTasks } from '../api/tasks';
import { getMe } from '../api/auth';
import { pingBackend } from '../api/axios';

const AppContext = createContext();

/* ── Rich task factory ── */
function createTask(overrides = {}) {
  return {
    id: overrides.id || `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: '',
    description: '',
    priority: 'medium',       // 'low' | 'medium' | 'high' | 'urgent'
    status: 'todo',           // 'todo' | 'inprogress' | 'done'
    category: 'personal',     // 'dsa' | 'fitness' | 'communication' | 'project' | 'personal'
    color: '#C7FF2A',
    estimatedTime: 30,        // minutes
    actualTime: 0,            // minutes
    checklists: [],           // [{ id, text, done }]
    notes: '',
    attachments: [],          // [{ id, name, url, type }]
    links: [],                // [{ id, label, url }]
    timerSessions: [],        // [{ start, end, duration }]
    tags: [],
    subtasks: [],             // [{ id, title, done }]
    history: [],              // [{ action, timestamp }]
    dueTime: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Compat fields
    done: false,
    inProgress: false,
    ...overrides,
  };
}

/* ── Initial state ── */
const initialState = {
  habits: [],
  tasks: [
    createTask({ id: 't1', title: 'Complete the DSA question', priority: 'high', category: 'dsa',           color: '#f87171', estimatedTime: 45 }),
    createTask({ id: 't2', title: 'Practice communication',    priority: 'medium', category: 'communication', color: '#34d399', estimatedTime: 30 }),
    createTask({ id: 't3', title: 'Face exercise',             priority: 'low',    category: 'fitness',       color: '#a78bfa', estimatedTime: 15 }),
    createTask({ id: 't4', title: 'Cardio',                    priority: 'medium', category: 'fitness',       color: '#fbbf24', estimatedTime: 40 }),
  ],
  user: null,
  stats: { score: 0, done: 0, missed: 0, streak: 0 },
  currentPage: 'home',
  sidebarCollapsed: false,
  dayStarted: false,
  isLoading: false,
  selectedHabitId: null,
  selectedTaskId: null,
  isAddHabitModalOpen: false,
  isAddTaskModalOpen: false,
  taskFilter: 'all',         // category filter for dashboard
  activeTimer: null,          // { taskId, startTime } or null
  selectedWorkspace: 'dsa',
};

/* ── Reducer ── */
function reducer(state, action) {
  switch (action.type) {
    /* ── Page / UI ── */
    case 'SET_PAGE':          return { ...state, currentPage: action.payload };
    case 'TOGGLE_SIDEBAR':    return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_LOADING':       return { ...state, isLoading: action.payload };
    case 'SET_DAY_STARTED':   return { ...state, dayStarted: action.payload };

    /* ── Auth / User ── */
    case 'SET_USER':          return { ...state, user: action.payload };
    case 'SET_STATS':         return { ...state, stats: action.payload };

    /* ── Habits ── */
    case 'SET_HABITS':        return { ...state, habits: action.payload };
    case 'SET_SELECTED_HABIT':return { ...state, selectedHabitId: action.payload };
    case 'SET_ADD_HABIT_MODAL': return { ...state, isAddHabitModalOpen: action.payload };
    case 'ADD_HABIT':         return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':      return { ...state, habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h) };
    case 'TOGGLE_HABIT':      return { ...state, habits: state.habits.map(h => h.id === action.payload ? { ...h, done: !h.done } : h) };
    case 'DELETE_HABIT':      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) };

    /* ── Tasks — CRUD ── */
    case 'SET_TASKS': {
      const raw = action.payload?.length > 0 ? action.payload : initialState.tasks;
      return { ...state, tasks: raw.map(t => createTask(t)) };
    }
    case 'SET_ADD_TASK_MODAL': return { ...state, isAddTaskModalOpen: action.payload };
    case 'ADD_TASK':          return { ...state, tasks: [...state.tasks, createTask(action.payload)] };
    case 'UPDATE_TASK':       return { ...state, tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload, updatedAt: new Date().toISOString() } : t) };
    case 'TOGGLE_TASK':       return { ...state, tasks: state.tasks.map(t => t.id === action.payload ? { ...t, done: !t.done, status: t.done ? 'todo' : 'done', updatedAt: new Date().toISOString() } : t) };
    case 'DELETE_TASK':       return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

    /* ── Tasks — Workspace ── */
    case 'SET_SELECTED_TASK': return { ...state, selectedTaskId: action.payload };
    case 'SET_TASK_FILTER':   return { ...state, taskFilter: action.payload };
    case 'SET_WORKSPACE':     return { ...state, selectedWorkspace: action.payload };

    case 'ADD_CHECKLIST_ITEM': {
      const { taskId, text } = action.payload;
      return { ...state, tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        checklists: [...t.checklists, { id: `cl-${Date.now()}`, text, done: false }],
        updatedAt: new Date().toISOString(),
      } : t) };
    }
    case 'TOGGLE_CHECKLIST_ITEM': {
      const { taskId, itemId } = action.payload;
      return { ...state, tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        checklists: t.checklists.map(c => c.id === itemId ? { ...c, done: !c.done } : c),
        updatedAt: new Date().toISOString(),
      } : t) };
    }
    case 'DELETE_CHECKLIST_ITEM': {
      const { taskId, itemId } = action.payload;
      return { ...state, tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        checklists: t.checklists.filter(c => c.id !== itemId),
        updatedAt: new Date().toISOString(),
      } : t) };
    }
    case 'UPDATE_TASK_NOTES': {
      const { taskId, notes } = action.payload;
      return { ...state, tasks: state.tasks.map(t => t.id === taskId ? { ...t, notes, updatedAt: new Date().toISOString() } : t) };
    }
    case 'ADD_TASK_LINK': {
      const { taskId, label, url } = action.payload;
      return { ...state, tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        links: [...t.links, { id: `lk-${Date.now()}`, label, url }],
        updatedAt: new Date().toISOString(),
      } : t) };
    }
    case 'DELETE_TASK_LINK': {
      const { taskId, linkId } = action.payload;
      return { ...state, tasks: state.tasks.map(t => t.id === taskId ? {
        ...t,
        links: t.links.filter(l => l.id !== linkId),
        updatedAt: new Date().toISOString(),
      } : t) };
    }

    /* ── Timer ── */
    case 'START_TIMER': {
      const taskId = action.payload;
      return {
        ...state,
        activeTimer: { taskId, startTime: Date.now() },
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'inprogress', inProgress: true } : t),
      };
    }
    case 'STOP_TIMER': {
      if (!state.activeTimer) return state;
      const { taskId, startTime } = state.activeTimer;
      const duration = Math.round((Date.now() - startTime) / 1000); // seconds
      return {
        ...state,
        activeTimer: null,
        tasks: state.tasks.map(t => t.id === taskId ? {
          ...t,
          timerSessions: [...t.timerSessions, { start: startTime, end: Date.now(), duration }],
          actualTime: t.actualTime + Math.round(duration / 60),
          updatedAt: new Date().toISOString(),
        } : t),
      };
    }

    default: return state;
  }
}

/* ── Provider ── */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => { pingBackend(); }, []);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const [userRes, habitsRes, tasksRes] = await Promise.all([
          getMe(),
          getHabits(),
          getTasks(),
        ]);
        dispatch({ type: 'SET_USER', payload: userRes.data });
        dispatch({ type: 'SET_HABITS', payload: habitsRes.data });
        dispatch({ type: 'SET_TASKS', payload: tasksRes.data });
      } catch (err) {
        console.error('Failed to fetch data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          setToken(null);
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    fetchData();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_HABITS', payload: [] });
    dispatch({ type: 'SET_TASKS', payload: [] });
  };

  return (
    <AppContext.Provider value={{ state, dispatch, token, login, logout, createTask }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
export default AppContext;