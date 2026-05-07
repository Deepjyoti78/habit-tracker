import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { getHabits } from '../api/habits';
import { getTasks } from '../api/tasks';
import { getMe } from '../api/auth';

const AppContext = createContext();

const initialState = {
  habits: [],
  tasks: [],
  user: null,
  stats: { score: 0, done: 0, missed: 0, streak: 0 },
  currentPage: 'home',
  sidebarCollapsed: false,
  dayStarted: false,
  isLoading: false,
  selectedHabitId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_HABITS': return { ...state, habits: action.payload };
    case 'SET_TASKS': return { ...state, tasks: action.payload };
    case 'SET_USER': return { ...state, user: action.payload };
    case 'SET_STATS': return { ...state, stats: action.payload };
    case 'SET_PAGE': return { ...state, currentPage: action.payload };
    case 'TOGGLE_SIDEBAR': return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SET_DAY_STARTED': return { ...state, dayStarted: action.payload };
    case 'SET_SELECTED_HABIT': return { ...state, selectedHabitId: action.payload };
    case 'ADD_HABIT': return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT': return {
      ...state,
      habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h)
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