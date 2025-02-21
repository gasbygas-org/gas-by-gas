import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Plus, Edit, Trash, Search, Filter } from 'lucide-react';
import apiClient from '../../api/apiClient';

const StockManagement = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGasType, setFilterGasType] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [selectedStock, setSelectedStock] = useState(null);
    const [newStock, setNewStock] = useState({ outletId: '', gasTypeId: '', quantity: '', stockId: '' });
    const [stocks, setStocks] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [gasTypes, setGasTypes] = useState([]);

    useEffect(() => {
        fetchStocks();
        fetchOutlets();
        fetchGasTypes();
    }, [searchQuery, filterGasType]);

    const fetchStocks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.get('/api/stock/stocks', {
                headers: { Authorization: `Bearer ${token}` },
                params: { query: searchQuery, gasTypeId: filterGasType },
            });
            setStocks(response.data);
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    const fetchOutlets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.get('/api/outlet', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOutlets(response.data);
        } catch (error) {
            console.error('Error fetching outlets:', error);
        }
    };

    const fetchGasTypes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.get('/api/gas-types/all', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGasTypes(response.data);
        } catch (error) {
            console.error('Error fetching gas types:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/admin/dashboard');
    };

    const handleAddStock = async () => {
        try {
            const token = localStorage.getItem('token');
            await apiClient.post('/api/stock/stocks', newStock, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStocks();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    };

    const handleEditStock = async () => {
        try {
            const token = localStorage.getItem('token');
            await apiClient.put('/api/stock/stocks', newStock, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStocks();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const handleDeleteStock = async () => {
        try {
            const token = localStorage.getItem('token');
            await apiClient.delete(`/api/stock/stocks/${selectedStock.stock_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStocks();
            setIsDeleteConfirmationOpen(false);
        } catch (error) {
            console.error('Error deleting stock:', error);
        }
    };

    const openModal = (stock = null) => {
        // console.log(stock);
        if (stock) {
            setSelectedStock(stock);
            setNewStock({ outletId: stock.outlet_id, gasTypeId: stock.gas_type_id, quantity: stock.quantity, stockId: stock.stock_id });
        } else {
            setNewStock({ outletId: '', gasTypeId: '', quantity: '', stockId: '' });
        }
        setIsModalOpen(true);
        // console.log(newStock);
    };

    const openDeleteConfirmation = (stock) => {
        setSelectedStock(stock);
        setIsDeleteConfirmationOpen(true);
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
                            Stock Management
                        </h2>
                        <div className="mb-6">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Stock
                            </button>
                        </div>
                        <div className="flex justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by location"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={filterGasType}
                                        onChange={(e) => setFilterGasType(e.target.value)}
                                        className="bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                    >
                                        <option value="">All Gas Types</option>
                                        {gasTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.gas_type_name}
                                            </option>
                                        ))}
                                    </select>
                                    <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {stocks.map((stock) => (
                                        <tr key={stock.stock_id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.outlet_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.gas_type_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openModal(stock)}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-4"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirmation(stock)}
                                                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            {selectedStock ? 'Edit Stock' : 'Add Stock'}
                        </h3>
                        <div className="space-y-4">
                            <select
                                value={newStock.outletId}
                                onChange={(e) => setNewStock({ ...newStock, outletId: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            >
                                <option value="">Select Outlet</option>
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.outlet_name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={newStock.gasTypeId}
                                onChange={(e) => setNewStock({ ...newStock, gasTypeId: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            >
                                <option value="">Select Gas Type</option>
                                {gasTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.gas_type_name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newStock.quantity}
                                onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedStock ? handleEditStock : handleAddStock}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                            >
                                {selectedStock ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteConfirmationOpen && (
                <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Confirm Deletion
                        </h3>
                        <p className="text-gray-300">Are you sure you want to delete this stock?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteConfirmationOpen(false)}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteStock}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default StockManagement;
