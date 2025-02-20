import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, Mail, User } from 'lucide-react';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [gasRequests] = useState([
        { id: 1, user_id: 1, gas_type_name: '12.5 kg Domestic', quantity: 1, request_status: 'Pending', token: 'TOKEN123' },
        { id: 2, user_id: 1, gas_type_name: '5 kg Domestic', quantity: 2, request_status: 'Approved', token: 'TOKEN456' },
        { id: 3, user_id: 5, gas_type_name: '37.5 kg Commercial', quantity: 1, request_status: 'Delivered', token: 'TOKEN789' },
    ]);

    const [notifications] = useState([
        { id: 1, message: 'Your gas request has been scheduled for delivery on 2025-02-10', status: 'Sent' },
        { id: 2, message: 'Your gas request has been approved. Please pick it up between 2025-02-05 and 2025-02-19', status: 'Sent' },
        { id: 3, message: 'Your gas request has been delivered on 2025-01-30', status: 'Delivered' },
    ]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user'));

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
                            <div className="flex items-center space-x-4">
                                {/* Home Link */}
                                <Link
                                    to="/"
                                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-md font-medium transition-colors"
                                >
                                    Home
                                </Link>

                                {/* User Name */}
                                {user && (
                                    <div className="flex items-center text-md text-gray-300">
                                        <User className="inline-block w-4 h-4 mr-1" />
                                        {user.name}
                                    </div>
                                )}

                                {/* Logout Button */}
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

                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {/* Overview Statistics Section */}
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 mb-8">
                        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Overview Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-300">
                                    <Package className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>Gas Requests: {gasRequests.length}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Mail className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>Notifications: {notifications.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links Section */}
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Quick Links
                        </h2>
                        <ul className="space-y-4">
                            <li>
                                <a href="/user/request-gas" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                    Request Gas
                                </a>
                            </li>
                            <li>
                                <a href="/user/gas-requests" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                    Gas Requests
                                </a>
                            </li>
                            <li>
                                <a href="/user/notifications" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                    Notifications
                                </a>
                            </li>
                            <li>
                                <a href="/user/reports" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                    Reports
                                </a>
                            </li>
                        </ul>
                    </div>
                </main>
            </div>

            {/* Radial gradient for hover effects */}
            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default UserDashboard;
