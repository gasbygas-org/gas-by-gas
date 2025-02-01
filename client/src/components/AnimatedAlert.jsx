// components/AnimatedAlert.jsx
import { m, AnimatePresence } from 'framer-motion';

const AnimatedAlert = ({ type, message }) => {
  const colors = {
    success: 'bg-green-500/10 border-green-500/50 text-green-400',
    error: 'bg-red-500/10 border-red-500/50 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
  };

  return (
    <AnimatePresence>
      {message && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`${colors[type]} px-4 py-3 rounded-xl border mb-6`}
        >
          {message}
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedAlert;
