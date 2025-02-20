import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ArrowLeft, Package, ShoppingCart, MessageCircle, FileText, User } from 'lucide-react';

const OutletManagerDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
            </div>

            <nav className="backdrop-blur-xl bg-gray-900/30 border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                Outlet Manager Dashboard
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

            <div className="relative">
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 mb-8">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Overview Statistics
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
                                <div className="flex items-center space-x-4">
                                    <Package className="w-8 h-8 text-blue-400" />
                                    <div>
                                        <p className="text-gray-300">Outlet Requests</p>
                                        <p className="text-2xl font-bold">3</p>
                                    </div>
                                </div>
                            </div>
                            <div className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
                                <div className="flex items-center space-x-4">
                                    <ShoppingCart className="w-8 h-8 text-blue-400" />
                                    <div>
                                        <p className="text-gray-300">Customer Requests</p>
                                        <p className="text-2xl font-bold">5</p>
                                    </div>
                                </div>
                            </div>
                            <div className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
                                <div className="flex items-center space-x-4">
                                    <MessageCircle className="w-8 h-8 text-blue-400" />
                                    <div>
                                        <p className="text-gray-300">Messages</p>
                                        <p className="text-2xl font-bold">2</p>
                                    </div>
                                </div>
                            </div>
                            <div className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
                                <div className="flex items-center space-x-4">
                                    <FileText className="w-8 h-8 text-blue-400" />
                                    <div>
                                        <p className="text-gray-300">Reports</p>
                                        <p className="text-2xl font-bold">1</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Quick Links
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <a
                                href="/outlet/outlet-requests"
                                className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50 hover:bg-gray-800/40 transition-all duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <Package className="w-8 h-8 text-blue-400" />
                                    <p className="text-gray-300">Outlet Request Management</p>
                                </div>
                            </a>
                            <a
                                href="/outlet/customer-requests"
                                className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50 hover:bg-gray-800/40 transition-all duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <ShoppingCart className="w-8 h-8 text-blue-400" />
                                    <p className="text-gray-300">Customer Request Management</p>
                                </div>
                            </a>
                            <a
                                href="/outlet/stocks"
                                className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50 hover:bg-gray-800/40 transition-all duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <ShoppingCart className="w-8 h-8 text-blue-400" />
                                    <p className="text-gray-300">Stocks</p>
                                </div>
                            </a>
                            <a
                                href="/outlet/reports"
                                className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50 hover:bg-gray-800/40 transition-all duration-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <FileText className="w-8 h-8 text-blue-400" />
                                    <p className="text-gray-300">Reports</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </main>
            </div>

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default OutletManagerDashboard;
