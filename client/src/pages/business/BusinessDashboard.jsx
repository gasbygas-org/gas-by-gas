import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Package, Mail, FileText, User } from 'lucide-react';
import apiClient from '../../api/apiClient';

const BusinessDashboard = () => {
    const navigate = useNavigate();
     const [gasRequestCount, setGasRequestCount] = useState(0); // State to store the gas request count
    const [gasRequests] = useState([
        { id: 1, user_id: 5, gas_type_name: '37.5 kg Commercial', quantity: 1, request_status: 'Pending', token: 'TOKEN789' },
    ]);

    const [notifications] = useState([
        { id: 2, message: 'Your gas request has been approved. Please pick it up between 2025-02-05 and 2025-02-19', status: 'Sent' },
    ]);

    const [organizationCertifications] = useState([
        { id: 5, user_id: 5, certification_path: '/path/to/certification1.pdf', status: 'Pending' },
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
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9nVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
            </div>

            <div className="relative">
                <nav className="backdrop-blur-xl bg-gray-900/30 border-b border-gray-700/50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                    Business Dashboard
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
                                    className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20 transition-all duration-200"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {/* Overview Statistics */}
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 mb-8">
    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Overview Statistics
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gas Requests Count */}
        <div className="bg-blue-500/20 p-6 rounded-xl shadow-xl border border-blue-500/50 hover:bg-blue-500/30 transition-colors duration-200">
            <div className="flex items-center justify-between">
                <Package className="w-8 h-8 text-blue-400" />
                <span className="text-lg font-semibold text-gray-300">Gas Requests</span>
            </div>
            <div className="mt-4 text-4xl font-bold text-gray-100">
                {isLoading ? 'Loading...' : error ? error : gasRequestCount}
            </div>
            <p className="text-sm text-gray-400 mt-2">Total gas requests made for your business.</p>
        </div>

        {/* Notifications Count
        <div className="bg-purple-500/20 p-6 rounded-xl shadow-xl border border-purple-500/50 hover:bg-purple-500/30 transition-colors duration-200">
            <div className="flex items-center justify-between">
                <Mail className="w-8 h-8 text-purple-400" />
                <span className="text-lg font-semibold text-gray-300">Notifications</span>
            </div>
            <div className="mt-4 text-4xl font-bold text-gray-100">
                {notifications.length}
            </div>
            <p className="text-sm text-gray-400 mt-2">Notifications sent to your business.</p>
        </div> */}

        {/* Business Registration Status */}
        <div className="bg-green-500/20 p-6 rounded-xl shadow-xl border border-green-500/50 hover:bg-green-500/30 transition-colors duration-200">
            <div className="flex items-center justify-between">
                <FileText className="w-8 h-8 text-green-400" />
                <span className="text-lg font-semibold text-gray-300">Business Registration</span>
            </div>
            <div className="mt-4 text-4xl font-bold text-gray-100">
                {organizationCertifications[0]?.status || 'Pending'}
            </div>
            <p className="text-sm text-gray-400 mt-2">Current status of your business registration.</p>
        </div>
    </div>
</div>


                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Quick Links
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Business Registration Link */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 hover:bg-gray-700 transition-colors duration-200">
            <Link to="/business/registration" className="flex flex-col items-center">
                <FileText className="w-8 h-8 mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-300 text-center">Business Registration</h3>
                <p className="text-gray-400 text-center mt-2">Complete or update your business details.</p>
            </Link>
        </div>

        {/* Request Gas Link */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 hover:bg-gray-700 transition-colors duration-200">
            <Link to="/business/request-gas" className="flex flex-col items-center">
                <Package className="w-8 h-8 mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-300 text-center">Request Gas</h3>
                <p className="text-gray-400 text-center mt-2">Request gas for your business needs.</p>
            </Link>
        </div>

        {/* Gas Requests Link */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 hover:bg-gray-700 transition-colors duration-200">
            <Link to="/business/gas-requests" className="flex flex-col items-center">
                <Package className="w-8 h-8 mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-300 text-center">Gas Requests</h3>
                <p className="text-gray-400 text-center mt-2">View and manage your gas requests.</p>
            </Link>
        </div>

        {/* Notifications Link */}
        {/* Uncomment this if you want to show Notifications Link */}
        {/* 
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 hover:bg-gray-700 transition-colors duration-200">
            <Link to="/business/notifications" className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-300 text-center">Notifications</h3>
                <p className="text-gray-400 text-center mt-2">View your recent notifications.</p>
            </Link>
        </div> 
        */}

        {/* Reports Link */}
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700/50 hover:bg-gray-700 transition-colors duration-200">
            <Link to="/business/reports" className="flex flex-col items-center">
                <FileText className="w-8 h-8 mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-300 text-center">Reports</h3>
                <p className="text-gray-400 text-center mt-2">View your business performance reports.</p>
            </Link>
        </div>
    </div>
</div>

                </main>
            </div>

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default BusinessDashboard;
