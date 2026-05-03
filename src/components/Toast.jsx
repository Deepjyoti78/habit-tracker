import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import './Toast.css';

export default function Toast() {
  const { state, dispatch } = useApp();
  const timerRef = useRef(null);

  useEffect(() => {
    if (state.toastMessage) {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'HIDE_TOAST' });
      }, 2500);
    }
    return () => clearTimeout(timerRef.current);
  }, [state.toastMessage, dispatch]);

  return (
    <AnimatePresence>
      {state.toastMessage && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <span className="toast-text">{state.toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
