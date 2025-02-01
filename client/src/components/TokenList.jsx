// src/components/TokenList.jsx
import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';
import { 
  Tag, MapPin, CheckCircle, Clock, AlertCircle, 
  ChevronRight, RefreshCw, Truck 
} from 'lucide-react';
import { useState } from 'react';

const TokenList = ({ tokens }) => {
  const [selectedToken, setSelectedToken] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'in progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'in progress':
        return <Truck className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const detailsVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: {
          duration: 0.3
        },
        opacity: {
          duration: 0.3
        }
      }
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-xl p-8 shadow-xl rounded-3xl border border-gray-800/50"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Your Gas Tokens
        </h2>
        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-xl bg-gray-800/50 text-gray-400 hover:text-white transition-colors duration-300"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="w-5 h-5" />
        </m.button>
      </div>
      
      {tokens.length > 0 ? (
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {tokens.map((token) => (
            <m.div
              key={token.id}
              variants={itemVariants}
              className="relative"
            >
              <m.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedToken(selectedToken === token.id ? null : token.id)}
                className="p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50 cursor-pointer group"
              >
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-gray-700/30">
                      <Tag className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="font-semibold text-gray-200">{token.id}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-gray-700/30">
                      <MapPin className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-gray-400">{token.outlet}</span>
                  </div>

                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${getStatusColor(token.status)}`}>
                    {getStatusIcon(token.status)}
                    <span>{token.status}</span>
                  </div>

                  <m.div
                    animate={{ rotate: selectedToken === token.id ? 90 : 0 }}
                    className="p-2 rounded-xl bg-gray-700/30 text-gray-400 group-hover:text-white transition-colors duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </m.div>
                </div>

                <AnimatePresence>
                  {selectedToken === token.id && (
                    <m.div
                      variants={detailsVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="mt-4 pt-4 border-t border-gray-700/50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p className="text-gray-400">Request Date: <span className="text-gray-200">2024-02-20</span></p>
                          <p className="text-gray-400">Delivery Time: <span className="text-gray-200">14:30</span></p>
                          <p className="text-gray-400">Gas Type: <span className="text-gray-200">Domestic</span></p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-400">Quantity: <span className="text-gray-200">2 Units</span></p>
                          <p className="text-gray-400">Payment: <span className="text-gray-200">Completed</span></p>
                          <p className="text-gray-400">Reference: <span className="text-gray-200">#REF123456</span></p>
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </m.div>
            </m.div>
          ))}
        </m.div>
      ) : (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No tokens found.</p>
          <p className="text-gray-500 mt-2">Submit a gas request to get started.</p>
        </m.div>
      )}
    </m.div>
  );
};

TokenList.propTypes = {
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      outlet: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TokenList;
