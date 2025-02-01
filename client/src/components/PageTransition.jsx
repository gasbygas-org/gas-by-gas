// components/PageTransition.jsx
import { m } from 'framer-motion';

const PageTransition = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
      bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <m.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <div className="relative w-16 h-16 mb-4 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-blue-400 border-r-blue-400 
            border-b-transparent border-l-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 border-4 border-t-purple-400 border-r-transparent 
            border-b-transparent border-l-transparent rounded-full animate-spin-slow" />
        </div>
        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-gray-300 font-medium"
        >
          Loading...
        </m.p>
      </m.div>
    </div>
  );
};

export default PageTransition;
