import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import TokenList from '../components/TokenList';
import OutletManager from '../components/OutletManager';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [userType, setUserType] = useState('');
  const [tokens, setTokens] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const userInfo = { type: 'consumer' };
          setUserType(userInfo.type);
          
          if (userInfo.type === 'consumer') {
            setTokens([
              { id: 'TKN12345', status: 'Pending', outlet: 'Outlet A' },
              { id: 'TKN67890', status: 'Completed', outlet: 'Outlet B' },
            ]);
          } else if (userInfo.type === 'manager') {
            setRequests([
              { id: 1, consumer: 'John Doe', gasType: 'Domestic', status: 'Pending' },
              { id: 2, consumer: 'Jane Smith', gasType: 'Industrial', status: 'Confirmed' },
            ]);
          }
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50">
        <m.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-blue-500" />
        </m.div>
      </div>
    );
  }

  return (
    
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/50 to-purple-900/50 py-8 px-4"
    >
      <div className="container mx-auto">
      <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-400">Manage your gas requests and deliveries</p>
          </div>

          {userType === 'consumer' && (
            <m.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-400">Your Gas Requests</h2>
              <TokenList tokens={tokens} />
            </m.div>
          )}

          {userType === 'manager' && (
            <m.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-300">Manage Gas Requests</h2>
              <OutletManager requests={requests} />
            </m.div>
          )}

          {userType === 'admin' && (
            <m.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-gray-800/30 backdrop-blur-md p-8 rounded-3xl border border-gray-700/50"
            >
              <h2 className="text-xl font-semibold text-gray-300 mb-4">Admin Overview</h2>
              <p className="text-gray-400">Admin-specific dashboard will go here.</p>
            </m.div>
          )}
        </div>
      </div>
    </m.div>
  );
};

export default Dashboard;
