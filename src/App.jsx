import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import MobileNavbar from './components/MobileNavbar';

import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import HabitsPage from './pages/HabitsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PlannerPage from './pages/PlannerPage';
import TimerPage from './pages/TimerPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import './App.css';

const pages = {
  home: HomePage,
  habits: HabitsPage,
  analytics: AnalyticsPage,
  planner: PlannerPage,
  timer: TimerPage,
  profile: ProfilePage,
  'edit-profile': EditProfilePage,
};

function AppContent() {
  const { state } = useApp();
  const PageComponent = pages[state.currentPage] || HomePage;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main" id="main-content">

        <div className="app-content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentPage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <MobileNavbar />
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
