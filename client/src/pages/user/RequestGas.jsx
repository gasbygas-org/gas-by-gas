import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Info, LogOut, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const RequestGas = () => {
    const navigate = useNavigate();
    const [stockInfo, setStockInfo] = useState({});
    const [checking, setChecking] = useState(false);
    const [stockError, setStockError] = useState('');
    const [formData, setFormData] = useState({
        gasTypeId: '',
        quantity: 1,
        outletId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Hardcoded data for outlets and gas types
    const outlets = [
        { id: 1, outlet_name: 'City Gas Outlet' },
        { id: 2, outlet_name: 'Suburban Gas Shop' },
        { id: 3, outlet_name: 'Kandy Gas Depot' }
    ];

    const gasTypes = [
        { id: 1, gas_type_name: '12.5 kg Domestic' },
        { id: 2, gas_type_name: '5 kg Domestic' },
        { id: 3, gas_type_name: '37.5 kg Commercial' }
    ];

    const checkStock = (outletId, gasTypeId, quantity) => {
        const availableStock = {
            1: { 1: 20, 2: 10 },
            2: { 1: 15, 3: 5 },
            3: { 1: 25 }
        };

        if (availableStock[outletId] && availableStock[outletId][gasTypeId] >= quantity) {
            setStockInfo({ isAvailable: true, availableQuantity: availableStock[outletId][gasTypeId] });
            return true;
        } else {
            setStockInfo({ isAvailable: false, availableQuantity: availableStock[outletId]?.[gasTypeId] || 0 });
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Check stock availability before submitting
        const isStockAvailable = checkStock(formData.outletId, formData.gasTypeId, formData.quantity);
        if (!isStockAvailable) {
            setError('Insufficient stock available.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/gas', formData);
            // Handle success response
            alert('Gas request submitted successfully!');
            navigate('/');
        } catch (err) {
            setError('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/user/dashboard'); // Navigate back to the user dashboard
    };

    const StockInfo = ({ info }) => {
        if (!info || !info.isAvailable) return null;

        return (
            <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center ${info.isAvailable
                ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                : 'bg-red-500/10 text-red-400 border border-red-500/50'
                }`}>
                <Info className="w-4 h-4 mr-2" />
                {info.isAvailable
                    ? `${info.availableQuantity} cylinders available`
                    : `Only ${info.availableQuantity} cylinders available`}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
            {/* Background pattern */}
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
            </div>

            {/* Navigation */}
            <nav className="backdrop-blur-xl bg-gray-900/30 border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBackToDashboard}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                    border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
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

            {/* Main content */}
            <div className="relative">
                <main className="max-w-md mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Request Gas
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center text-red-400">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Outlet
                                </label>
                                <select
                                    value={formData.outletId}
                                    onChange={(e) => setFormData({ ...formData, outletId: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                    required
                                >
                                    <option value="">Select an Outlet</option>
                                    {outlets.map((outlet) => (
                                        <option key={outlet.id} value={outlet.id}>
                                            {outlet.outlet_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Gas Type
                                </label>
                                <select
                                    value={formData.gasTypeId}
                                    onChange={(e) => setFormData({ ...formData, gasTypeId: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                    required
                                >
                                    <option value="">Select Gas Type</option>
                                    {gasTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.gas_type_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                    required
                                />
                            </div>

                            <StockInfo info={stockInfo} />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                            >
                                {loading ? 'Processing...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </main>
            </div>

            {/* Radial gradient for hover effects */}
            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default RequestGas;
