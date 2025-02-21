import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, Mail, User } from 'lucide-react';
import apiClient from '../../api/apiClient';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [gasRequestCount, setGasRequestCount] = useState(0); // State to store the gas request count
    const [notifications] = useState([
        { id: 1, message: 'Your gas request has been scheduled for delivery on 2025-02-10', status: 'Sent' },
        { id: 2, message: 'Your gas request has been approved. Please pick it up between 2025-02-05 and 2025-02-19', status: 'Sent' },
        { id: 3, message: 'Your gas request has been delivered on 2025-01-30', status: 'Delivered' },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);  // Error handling state

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user'));

    // Fetch gas request count based on user ID when the component mounts
    const fetchGasRequestCount = async () => {
        setIsLoading(true);
        setError(null); // Reset error state before API call
        try {
            const userId = user?.id; // Get user ID from local storage
            const token = localStorage.getItem('token'); // Get token from local storage

            if (!userId || !token) {
                throw new Error('User ID or token is missing.');
            }

            // Make API call to fetch the gas request count
            const response = await apiClient.get(`/api/request/gas-requests/count/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setGasRequestCount(response.data.request_count); // Set the gas request count
        } catch (error) {
            console.error('Error fetching gas request count:', error);
            setError('Failed to fetch gas request count. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGasRequestCount(); // Fetch gas request count when the component mounts
    }, []); // Empty dependency array ensures it only runs once when the component mounts

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
                        <div className="flex justify-center items-center gap-8">
                            {/* Gas Requests Box */}
                            <div className="flex items-center justify-center bg-blue-100 text-blue-500 rounded-xl px-8 py-6 text-2xl shadow-xl">
                                <Package className="w-6 h-6 mr-3 text-blue-400" />
                                <span>
                                    Gas Requests: {isLoading ? 'Loading...' : error ? error : gasRequestCount}
                                </span>
                            </div>

                            {/* Notifications Box
                            <div className="flex items-center justify-center bg-purple-100 text-purple-500 rounded-xl px-8 py-6 text-2xl shadow-xl">
                                <Mail className="w-6 h-6 mr-3 text-purple-400" />
                                <span>Notifications: {notifications.length}</span>
                            </div> */}
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
