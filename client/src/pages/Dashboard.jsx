import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Phone, CreditCard, MapPin } from 'lucide-react'; // Import icons
import API from '../api/config';

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserData(user);
        } else {
            navigate('/login');
        }
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

            {/* Main content */}
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
                            <div className="flex items-center">
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 
                                        border border-red-500/50 rounded-xl hover:bg-red-500/20 
                                        transition-all duration-200"
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

                                {/* Additional Dashboard Components */}
                                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-200">
                                        Recent Activities
                                    </h3>
                                    <p className="text-gray-400">
                                        No recent activities to display.
                                    </p>
                                </div>
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
