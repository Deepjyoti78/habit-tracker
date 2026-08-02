import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import MobileNavbar from './components/MobileNavbar';
import LoginPage from './pages/LoginPage';

import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import HabitsPage from './pages/HabitsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PlannerPage from './pages/PlannerPage';
import TimerPage from './pages/TimerPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AddHabitModal from './components/AddHabitModal';
import AddTaskModal from './components/AddTaskModal';
import CreateHabitPage from './pages/CreateHabitPage';
import HabitTrackerPage from './pages/HabitTrackerPage';
import WorkspacePage from './pages/WorkspacePage';
import DsaSessionDetailsPage from './pages/DsaSessionDetailsPage';
import './App.css';
import './components/NebulaTheme.css';

const pages = {
  home: HomePage,
  habits: HabitsPage,
  analytics: AnalyticsPage,
  planner: PlannerPage,
  timer: TimerPage,
  profile: ProfilePage,
  'edit-profile': EditProfilePage,
  'create-habit': CreateHabitPage,
  tracker: HabitTrackerPage,
  workspace: WorkspacePage,
  'dsa-session': DsaSessionDetailsPage,
};

function AppContent() {
  const { state, token } = useApp();
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [state.currentPage, state.selectedWorkspace]);

  if (!token) return <LoginPage />;
  const PageComponent = pages[state.currentPage] || HomePage;

  return (
    <div className={`app-shell ${state.currentPage === 'tracker' ? 'is-tracker' : ''}`}>
      <Sidebar />
      <main className="app-main" id="main-content">
        <div className="app-content-area" ref={contentRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentPage}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      {state.currentPage !== 'tracker' && <MobileNavbar />}
      <AnimatePresence>
        {state.isAddHabitModalOpen && <AddHabitModal />}
        {state.isAddTaskModalOpen && <AddTaskModal />}
      </AnimatePresence>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
