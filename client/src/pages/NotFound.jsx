// src/pages/NotFound.jsx
import { m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center px-4"
    >
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-gray-400">Page not found</p>
        <Link to="/">
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white shadow-lg flex items-center gap-2 mx-auto"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </m.button>
        </Link>
      </div>
    </m.div>
  );
};

export default NotFound;
