import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { getHabits } from '../api/habits';
import { getTasks } from '../api/tasks';
import { getMe } from '../api/auth';
import { pingBackend } from '../api/axios';

const AppContext = createContext();

const initialState = {
  habits: [],
  tasks: [
    { id: 't1', title: 'Complete the DSA question', done: false, color: '#ef4444' },
    { id: 't2', title: 'Practice communication', done: false, color: '#22c55e' },
    { id: 't3', title: 'Face exercise', done: false, color: '#a855f7' },
    { id: 't4', title: 'Cardio', done: false, color: '#f59e0b' }
  ],
  user: null,
  stats: { score: 0, done: 0, missed: 0, streak: 0 },
  currentPage: 'home',
  sidebarCollapsed: false,
  dayStarted: false,
  isLoading: false,
  selectedHabitId: null,
  isAddHabitModalOpen: false,
  isAddTaskModalOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_HABITS': return { ...state, habits: action.payload };
    case 'SET_TASKS': return { ...state, tasks: action.payload?.length > 0 ? action.payload : initialState.tasks };
    case 'SET_USER': return { ...state, user: action.payload };
    case 'SET_STATS': return { ...state, stats: action.payload };
    case 'SET_PAGE': return { ...state, currentPage: action.payload };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SET_DAY_STARTED': return { ...state, dayStarted: action.payload };
    case 'SET_SELECTED_HABIT': return { ...state, selectedHabitId: action.payload };
    case 'SET_ADD_HABIT_MODAL': return { ...state, isAddHabitModalOpen: action.payload };
    case 'SET_ADD_TASK_MODAL': return { ...state, isAddTaskModalOpen: action.payload };
    case 'ADD_HABIT': return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT': return {
      ...state,
      habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h)
    };
    case 'TOGGLE_HABIT': return {
      ...state,
      habits: state.habits.map(h => h.id === action.payload ? { ...h, done: !h.done } : h)
    };
    case 'DELETE_HABIT': return {
      ...state,
      habits: state.habits.filter(h => h.id !== action.payload)
    };
    case 'ADD_TASK': return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK': return {
      ...state,
      tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t)
    };
    case 'TOGGLE_TASK': return {
      ...state,
      tasks: state.tasks.map(t => t.id === action.payload ? { ...t, done: !t.done } : t)
    };
    case 'DELETE_TASK': return {
      ...state,
      tasks: state.tasks.filter(t => t.id !== action.payload)
    };
    default: return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Silently ping backend on load so Render free-tier wakes before login
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
    <AppContext.Provider value={{ state, dispatch, token, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
export default AppContext;