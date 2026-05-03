import { createContext, useContext, useReducer, useEffect } from 'react';
import { defaultHabits, weeklyStats } from '../data/appData';

const AppContext = createContext(null);

const STORAGE_KEY = 'discipline-os-state';

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
  return null;
}

const initialState = loadState() || {
  habits: defaultHabits,
  stats: weeklyStats,
  currentPage: 'home',
  sidebarCollapsed: false,
  toastMessage: null,
  dayStarted: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_HABIT': {
      const habits = state.habits.map((h) =>
        h.id === action.payload
          ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1) }
          : h
      );
      const doneCount = habits.filter((h) => h.done).length;
      const score = Math.round((doneCount / habits.length) * 100);
      return {
        ...state,
        habits,
        stats: { ...state.stats, score, done: doneCount, missed: habits.length - doneCount },
      };
    }
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toastMessage: null };
    case 'START_DAY':
      return { ...state, dayStarted: true };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter((h) => h.id !== action.payload) };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
