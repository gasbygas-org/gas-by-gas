import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Check, X, Truck, MessageCircle } from 'lucide-react';

const CustomerRequestManagement = () => {
    const navigate = useNavigate();

    const users = [
        { id: 1, name: 'GBG User', role: 'user' },
        { id: 2, name: 'GBG Admin', role: 'admin' },
        { id: 3, name: 'GBG Dispatch Admin', role: 'dispatch_admin' },
        { id: 4, name: 'GBG Outlet Manager', role: 'outlet_manager' },
        { id: 5, name: 'GBG Business', role: 'business' }
    ];

    const [customerRequests, setCustomerRequests] = useState([
        { id: 1, user_id: 1, gasType: '12.5 kg Domestic', quantity: 1, request_status: 'Pending', token: 'TOKEN123', created_at: '2025-01-29 18:26:24', updated_at: '2025-01-30 08:43:56' },
        { id: 2, user_id: 1, gasType: '5 kg Domestic', quantity: 2, request_status: 'Approved', token: 'TOKEN456', created_at: '2025-01-29 18:26:24', updated_at: '2025-01-30 08:44:01' },
        { id: 3, user_id: 5, gasType: '37.5 kg Commercial', quantity: 1, request_status: 'Delivered', token: 'TOKEN789', created_at: '2025-01-29 18:26:24', updated_at: '2025-01-30 08:43:43' }
    ]);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isReallocateModalOpen, setIsReallocateModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [newTokenHolder, setNewTokenHolder] = useState('');
    const [message, setMessage] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/outlet/dashboard');
    };

    const handleApproveRequest = (id) => {
        setCustomerRequests(customerRequests.map((request) => (request.id === id ? { ...request, request_status: 'Approved' } : request)));
        setIsConfirmationModalOpen(false);
    };

    const handleRejectRequest = (id) => {
        setCustomerRequests(customerRequests.map((request) => (request.id === id ? { ...request, request_status: 'Rejected' } : request)));
        setIsConfirmationModalOpen(false);
    };

    const handleMarkAsDelivered = (id) => {
        setCustomerRequests(customerRequests.map((request) => (request.id === id ? { ...request, request_status: 'Delivered' } : request)));
        setIsConfirmationModalOpen(false);
    };

    const handleReallocateToken = () => {
        setCustomerRequests(customerRequests.map((request) => (request.id === selectedRequest.id ? { ...request, token: newTokenHolder } : request)));
        setIsReallocateModalOpen(false);
        setSelectedRequest(null);
        setNewTokenHolder('');
        setMessage('');
    };

    const openReallocateModal = (request) => {
        setSelectedRequest(request);
        setIsReallocateModalOpen(true);
    };

    const openConfirmationModal = (request, action) => {
        setSelectedRequest(request);
        setActionType(action);
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmation = () => {
        if (actionType === 'approve') {
            handleApproveRequest(selectedRequest.id);
        } else if (actionType === 'reject') {
            handleRejectRequest(selectedRequest.id);
        } else if (actionType === 'delivered') {
            handleMarkAsDelivered(selectedRequest.id);
        }
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
                            Customer Request Management
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {customerRequests.map((request) => (
                                        <tr key={request.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.user_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.gasType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.request_status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.token}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.created_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.updated_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openConfirmationModal(request, 'approve')}
                                                    className="text-green-400 hover:text-green-300 transition-colors duration-200 mr-4"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openConfirmationModal(request, 'reject')}
                                                    className="text-red-400 hover:text-red-300 transition-colors duration-200 mr-4"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openConfirmationModal(request, 'delivered')}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-4"
                                                >
                                                    <Truck className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openReallocateModal(request)}
                                                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
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

            {isReallocateModalOpen && (
                <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Reallocate Token
                        </h3>
                        <div className="space-y-4">
                            <select
                                value={newTokenHolder}
                                onChange={(e) => setNewTokenHolder(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            >
                                <option value="">Select New Token Holder</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.name}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Message to Current Token Holder"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            />
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsReallocateModalOpen(false)}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReallocateToken}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                            >
                                Reallocate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isConfirmationModalOpen && (
                <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Confirm {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Mark as Delivered'}
                        </h3>
                        <p className="text-gray-300">Are you sure you want to {actionType} this request?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsConfirmationModalOpen(false)}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmation}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default CustomerRequestManagement;
