import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft } from 'lucide-react';

const RequestGas = () => {
    const navigate = useNavigate();

    const [outlets] = useState([
        { id: 1, outlet_name: 'City Gas Outlet' },
        { id: 2, outlet_name: 'Suburban Gas Shop' },
        { id: 3, outlet_name: 'Kandy Gas Depot' },
    ]);

    const [gasTypes] = useState([
        { id: 1, gas_type_name: '12.5 kg Domestic' },
        { id: 2, gas_type_name: '5 kg Domestic' },
        { id: 3, gas_type_name: '37.5 kg Commercial' },
    ]);

    const [selectedOutlet, setSelectedOutlet] = useState('');
    const [selectedGasType, setSelectedGasType] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/business/dashboard');
    };

    const handleRequest = () => {
        console.log('Request Gas:', { selectedOutlet, selectedGasType, quantity });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
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
                <main className="max-w-md mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Request Gas
                        </h2>
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Select Outlet</label>
                                <select
                                    value={selectedOutlet}
                                    onChange={(e) => setSelectedOutlet(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                >
                                    <option value="">Select an Outlet</option>
                                    <option value="1">City Gas Outlet</option>
                                    <option value="2">Suburban Gas Shop</option>
                                    <option value="3">Kandy Gas Depot</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Gas Type</label>
                                <select
                                    value={selectedGasType}
                                    onChange={(e) => setSelectedGasType(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                >
                                    <option value="">Select Gas Type</option>
                                    <option value="1">12.5 kg Domestic</option>
                                    <option value="2">5 kg Domestic</option>
                                    <option value="3">37.5 kg Commercial</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                    min="1"
                                />
                            </div>
                            <button
                                onClick={handleRequest}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                            >
                                Submit Request
                            </button>
                        </form>
                    </div>
                </main>
            </div>

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default RequestGas;
