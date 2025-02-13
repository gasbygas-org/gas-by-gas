import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Bell, Info } from 'lucide-react';

const Notifications = () => {
    const navigate = useNavigate();

    const [notifications] = useState([
        { id: 1, message: 'Your gas request has been scheduled for delivery on 2025-02-10', status: 'Sent' },
        { id: 2, message: 'Your gas request has been approved. Please pick it up between 2025-02-05 and 2025-02-19', status: 'Sent' },
        { id: 3, message: 'Your gas request has been delivered on 2025-01-30', status: 'Delivered' },
    ]);

    const [selectedNotification, setSelectedNotification] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/business/dashboard');
    };

    const handleViewDetails = (notification) => {
        setSelectedNotification(notification);
    };

    const handleCloseDetails = () => {
        setSelectedNotification(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
            </div>

            <nav className="backdrop-blur-xl bg-gray-900/30 border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBackToDashboard}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20 transition-all duration-200"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative">
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Notifications
                        </h2>
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="p-4 bg-gray-900/20 rounded-xl hover:bg-gray-900/30 transition-all duration-200 cursor-pointer"
                                    onClick={() => handleViewDetails(notification)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <Bell className="w-5 h-5 text-blue-400" />
                                            <span className="text-gray-300">{notification.message}</span>
                                        </div>
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full ${notification.status === 'Sent'
                                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/50'
                                                : notification.status === 'Delivered'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                                                    : 'bg-red-500/10 text-red-400 border border-red-500/50'
                                                }`}
                                        >
                                            {notification.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {selectedNotification && (
                <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Notification Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm text-gray-400">Message:</span>
                                <p className="text-gray-300">{selectedNotification.message}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-400">Status:</span>
                                <p className="text-gray-300">{selectedNotification.status}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCloseDetails}
                            className="mt-6 w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default Notifications;
