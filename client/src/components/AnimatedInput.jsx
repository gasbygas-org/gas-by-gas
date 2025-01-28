// components/AnimatedInput.jsx
import { m } from 'framer-motion';

const AnimatedInput = ({ error, ...props }) => {
  return (
    <div className="relative">
      <m.input
        {...props}
        animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className={`w-full px-4 py-2.5 bg-gray-900/50 border rounded-xl 
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
          text-gray-200 placeholder-gray-500 transition-colors duration-200
          ${error ? 'border-red-500/50' : 'border-gray-700/50'}`}
      />
      {error && (
        <m.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -bottom-6 left-0 text-xs text-red-400"
        >
          {error}
        </m.span>
      )}
    </div>
  );
};

export default AnimatedInput;