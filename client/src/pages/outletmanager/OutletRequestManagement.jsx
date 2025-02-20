import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Plus, Edit, Trash } from 'lucide-react';

const OutletRequestManagement = () => {
    const navigate = useNavigate();

    const gasTypes = [
        { id: 1, gasType: '12.5 kg Domestic' },
        { id: 2, gasType: '5 kg Domestic' },
        { id: 3, gasType: '37.5 kg Commercial' },
    ];

    const [outletRequests, setOutletRequests] = useState([
        { id: 1, gasType: '12.5 kg Domestic', quantity: 20, status: 'Pending', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52' },
        { id: 2, gasType: '5 kg Domestic', quantity: 15, status: 'Approved', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52' },
        { id: 3, gasType: '37.5 kg Commercial', quantity: 10, status: 'Delivered', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52' }
    ]);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ gasType: '', quantity: '', status: 'Pending' });

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/outlet/dashboard');
    };

    const handleAddRequest = () => {
        setOutletRequests([...outletRequests, { id: outletRequests.length + 1, ...newRequest, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
        setNewRequest({ gasType: '', quantity: '', status: 'Pending' });
        setIsModalOpen(false);
    };

    const handleEditRequest = () => {
        setOutletRequests(outletRequests.map((request) => (request.id === selectedRequest.id ? { ...newRequest, updated_at: new Date().toISOString() } : request)));
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const handleDeleteRequest = () => {
        setOutletRequests(outletRequests.filter((request) => request.id !== selectedRequest.id));
        setIsDeleteConfirmationOpen(false);
        setSelectedRequest(null);
    };

    const openModal = (request = null) => {
        if (request) {
            setSelectedRequest(request);
            setNewRequest(request);
        } else {
            setNewRequest({ gasType: '', quantity: '', status: 'Pending' });
        }
        setIsModalOpen(true);
    };

    const openDeleteConfirmation = (request) => {
        setSelectedRequest(request);
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

            <div className="relative">
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Outlet Request Management
                        </h2>
                        <div className="mb-6">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                    border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Request
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Request ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {outletRequests.map((request) => (
                                        <tr key={request.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.gasType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.created_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.updated_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openModal(request)}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-4"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirmation(request)}
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
                            {selectedRequest ? 'Edit Request' : 'Add Request'}
                        </h3>
                        <div className="space-y-4">
                            <select
                                value={newRequest.gasType}
                                onChange={(e) => setNewRequest({ ...newRequest, gasType: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            >
                                <option value="">Select Gas Type</option>
                                {gasTypes.map((gas) => (
                                    <option key={gas.id} value={gas.gasType}>
                                        {gas.gasType}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newRequest.quantity}
                                onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
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
                                onClick={selectedRequest ? handleEditRequest : handleAddRequest}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                            >
                                {selectedRequest ? 'Update' : 'Add'}
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
                        <p className="text-gray-300">Are you sure you want to delete this request?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteConfirmationOpen(false)}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteRequest}
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

export default OutletRequestManagement;
