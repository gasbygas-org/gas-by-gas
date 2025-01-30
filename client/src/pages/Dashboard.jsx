import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Phone, CreditCard, MapPin, Bell } from 'lucide-react';
import RequestHistory from '../components/User/RequestHistory';
import TokenCard from '../components/User/TokenCard';
import NotificationList from '../components/User/NotificationList';
import API from '../api/config';

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [requests, setRequests] = useState([]);
    const [activeToken, setActiveToken] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Get user data
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    navigate('/login');
                    return;
                }
                setUserData(user);

                // Fetch requests, active token, and notifications
                const [requestsRes, tokenRes, notificationsRes] = await Promise.all([
                    API.get('/user/gas/requests'),
                    API.get('/user/active-token'),
                    API.get('/user/notifications')
                ]);

                setRequests(requestsRes.data.requests);
                setActiveToken(tokenRes.data.token);
                setNotifications(notificationsRes.data.notifications);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);
    

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
            {/* Background pattern */}
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
            </div>
            <div className="relative">
                {/* Navigation */}
                <nav className="backdrop-blur-xl bg-gray-900/30 border-b border-gray-700/50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                    User Dashboard
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Notification Bell */}
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <Bell className="w-6 h-6" />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1 -translate-y-1" />
                                    )}
                                </button>
                                
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 
                                        border border-red-500/50 rounded-xl hover:bg-red-500/20 transition-all duration-200"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {userData && (
                        <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                Welcome, {userData.name}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Profile Information */}
                                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-200">
                                        Profile Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center text-gray-300">
                                            <User className="w-5 h-5 mr-3 text-blue-400" />
                                            <span>{userData.name}</span>
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <Mail className="w-5 h-5 mr-3 text-blue-400" />
                                            <span>{userData.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <Phone className="w-5 h-5 mr-3 text-blue-400" />
                                            <span>{userData.phone}</span>
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <CreditCard className="w-5 h-5 mr-3 text-blue-400" />
                                            <span>{userData.nic}</span>
                                        </div>
                                        <div className="flex items-center text-gray-300">
                                            <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                                            <span>{userData.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <TokenCard token={activeToken} />
                                </div>

                                {/* Add Request History */}
                                <div className="mb-8">
                                    <RequestHistory requests={requests} />
                                </div>

                                {/* Add Notification List as a modal */}
                                {showNotifications && (
                                    <NotificationList 
                                        notifications={notifications}
                                        onClose={() => setShowNotifications(false)}
                                    />
                                )}

                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Radial gradient for hover effects */}
            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default UserDashboard;
