// src/components/OutletManager.jsx
import PropTypes from 'prop-types';
import { m, AnimatePresence } from 'framer-motion';
import { 
    Clock, Filter, Search, 
   MoreVertical, Truck, AlertCircle,
  CheckCircle, XCircle, MapPin, User
} from 'lucide-react';
//RefreshCw, Check, ChevronDown, Gas
import { useState } from 'react';

const OutletManager = ({ requests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showActions, setShowActions] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'in progress':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'cancelled':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'in progress':
        return <Truck className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.id.toString().includes(searchTerm) ||
      req.consumer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.gasType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      statusFilter === 'all' || 
      req.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handleStatusUpdate = (requestId, newStatus) => {
    console.log(`Updating request ${requestId} to ${newStatus}`);
    setShowActions(null);
  };

  return (
    <m.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto bg-gray-900/50 backdrop-blur-xl p-8 shadow-xl rounded-3xl border border-gray-800/50"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Gas Delivery Requests
        </h2>
        
        <div className="flex flex-wrap gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl cursor-pointer">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-gray-200"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredRequests.map((req) => (
            <m.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-wrap gap-6 items-center justify-between">
                  {/* Request ID and Customer */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Request ID:</span>
                      <span className="font-semibold text-gray-200">#{req.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-200">{req.consumer}</span>
                    </div>
                  </div>

                  {/* Gas Type and Location */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-400" />
                      <span className="text-gray-200">{req.gasType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-red-400" />
                      <span className="text-gray-400">Location A</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(req.status)}`}>
                    {getStatusIcon(req.status)}
                    <span>{req.status}</span>
                  </div>

                  {/* Actions */}
                  <div className="relative">
                    <m.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowActions(showActions === req.id ? null : req.id)}
                      className="p-2 rounded-xl bg-gray-700/30 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </m.button>

                    <AnimatePresence>
                      {showActions === req.id && (
                        <m.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl border border-gray-700/50 overflow-hidden z-10"
                        >
                          {['Confirm', 'Start Delivery', 'Complete', 'Cancel'].map((action) => (
                            <button
                              key={action}
                              onClick={() => handleStatusUpdate(req.id, action.toLowerCase())}
                              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700/50 transition-colors duration-300"
                            >
                              {action}
                            </button>
                          ))}
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {selectedRequest === req.id && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-gray-700/50"
                    >
                      {/* Additional request details can go here */}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>
          ))}
        </AnimatePresence>

        {filteredRequests.length === 0 && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No requests found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </m.div>
        )}
      </div>
    </m.div>
  );
};

OutletManager.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      consumer: PropTypes.string.isRequired,
      gasType: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default OutletManager;
