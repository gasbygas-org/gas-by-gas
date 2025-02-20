import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Check, X, Truck, MessageCircle, Loader2 } from 'lucide-react';
import { m } from 'framer-motion';
import AnimatedAlert from '../../components/AnimatedAlert';
import apiClient from '../../api/apiClient';

const CustomerRequestManagement = () => {
    const navigate = useNavigate();

    const [gasRequests, setGasRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isReallocateModalOpen, setIsReallocateModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [actionType, setActionType] = useState('');
    const [newTokenHolder, setNewTokenHolder] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [gasRequestCustomers, setGasRequestCustomers] = useState([]);

    const requestsPerPage = 10;

    const fetchGasRequests = async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            const response = await apiClient.get(`/api/request/gas/requests`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    outletId: user.outletId,
                    page: page,
                    pageSize: requestsPerPage,
                },
            });

            const pagination = response.data.pagination;

            setGasRequests(response.data.data);
            setTotalPages(pagination.totalPages);
        } catch (error) {
            setError('Failed to fetch gas requests. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchGasRequestCustomers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.get(`/api/user/gas-request-customers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);

            setGasRequestCustomers(response.data.users);
        } catch (error) {
            setError('Failed to fetch gas request customers. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const rejectGasRequest = async (requestId) => {
        setIsLoading(true);
        setError(null);
        setStatusMessage({ type: '', message: '' });
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.post(`/api/request/gas/reject`,
                { requestId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setStatusMessage({
                type: 'success',
                message: 'Gas request rejected!'
            });
        } catch (error) {
            console.log(error);
            setError('Failed to reject gas request. Please try again later.');
            setStatusMessage({
                type: 'error',
                message: /*error.message || */'Failed to reject gas request!'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const approveGasRequest = async (requestId) => {
        setIsLoading(true);
        setError(null);
        setStatusMessage({ type: '', message: '' });
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.post(`/api/request/gas/approve`,
                { requestId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setStatusMessage({
                type: 'success',
                message: 'Gas request approved!'
            });
        } catch (error) {
            console.log(error);
            setError('Failed to approve gas request. Please try again later.');
            setStatusMessage({
                type: 'error',
                message: /*error.message || */'Failed to approve gas request!'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const deliveredGasRequest = async (requestId) => {
        setIsLoading(true);
        setError(null);
        setStatusMessage({ type: '', message: '' });
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.post(`/api/request/gas/delivered`,
                { requestId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setStatusMessage({
                type: 'success',
                message: 'Gas request delivered!'
            });
        } catch (error) {
            console.log(error);
            setError('Failed to deliver gas request. Please try again later.');
            setStatusMessage({
                type: 'error',
                message: /*error.message || */'Failed to deliver gas request!'
            });
        } finally {
            setIsLoading(false);
        }
    }

    const reallocateToken = async (requestId, newUserId, message) => {
        setIsLoading(true);
        setError(null);
        setStatusMessage({ type: '', message: '' });
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.post(`/api/request/gas/reallocate`,
                { requestId, newUserId, message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            setStatusMessage({
                type: 'success',
                message: 'Gas request re-allocated!'
            });
        } catch (error) {
            console.log(error);
            setError('Failed to re-allocate gas request. Please try again later.');
            setStatusMessage({
                type: 'error',
                message: /*error.message || */'Failed to re-allocate gas request!'
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchGasRequests(1);
        fetchGasRequestCustomers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/outlet/dashboard');
    };

    const handleApproveRequest = async (id) => {
        await approveGasRequest(id);
        await fetchGasRequests(1);
        setIsConfirmationModalOpen(false);
    };

    const handleRejectRequest = async (id) => {
        await rejectGasRequest(id);
        await fetchGasRequests(1);
        setIsConfirmationModalOpen(false);
    };

    const handleMarkAsDelivered = async (id) => {
        await deliveredGasRequest(id);
        await fetchGasRequests(1);
        setIsConfirmationModalOpen(false);
    };

    const handleReallocateToken = async () => {
        await reallocateToken(selectedRequest.id, newTokenHolder, message);
        await fetchGasRequests(1);
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

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchGasRequests(nextPage);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            fetchGasRequests(prevPage);
        }
    };

    const LoadingScreen = () => (
        <div className="min-h-screen flex items-center justify-center">
            <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <Loader2 className="w-8 h-8 text-blue-500" />
            </m.div>
        </div>
    );

    const setStatusMessage = (status, timeout = 3000) => {
        setStatus(status);
        setTimeout(() => {
            setStatus({ type: '', message: '' });
        }, timeout);
    }

    return (
        isLoading ?
            <LoadingScreen /> :
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
                        <AnimatedAlert
                            type={status.type}
                            message={status.message}
                        />
                        <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                Customer Request Management
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User NIC</th>
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
                                        {gasRequests.map((request) => {
                                            const disableApprove = request.request_status !== 'Pending';
                                            const disableReject = request.request_status !== 'Pending';
                                            const disableDeliver = request.request_status !== 'Approved';
                                            const disableReallocate = request.request_status !== 'Pending';

                                            const disableApproveStyle = disableApprove ? 'opacity-50 cursor-not-allowed' : '';
                                            const disableRejectStyle = disableReject ? 'opacity-50 cursor-not-allowed' : '';
                                            const disableDeliverStyle = disableDeliver ? 'opacity-50 cursor-not-allowed' : '';
                                            const disableReallocateStyle = disableReallocate ? 'opacity-50 cursor-not-allowed' : '';

                                            return (
                                                <tr key={request.id} className="bg-gray-900/20">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.user_nic}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.gas_type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.request_status}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.token}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.created_at}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.updated_at}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            disabled={disableApprove}
                                                            onClick={() => openConfirmationModal(request, 'approve')}
                                                            className={`text-green-400 hover:text-green-300 transition-colors duration-200 mr-4 
                                                                ${disableApproveStyle}`}
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            disabled={disableReject}
                                                            onClick={() => openConfirmationModal(request, 'reject')}
                                                            className={`text-red-400 hover:text-red-300 transition-colors duration-200 mr-4 
                                                                ${disableRejectStyle}`}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            disabled={disableDeliver}
                                                            onClick={() => openConfirmationModal(request, 'delivered')}
                                                            className={`text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-4 
                                                                ${disableDeliverStyle}`}
                                                        >
                                                            <Truck className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            disabled={disableReallocate}
                                                            onClick={() => openReallocateModal(request)}
                                                            className={`text-purple-400 hover:text-purple-300 transition-colors duration-200 
                                                                ${disableReallocateStyle}`}
                                                        >
                                                            <MessageCircle className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center items-center mt-6 space-x-4">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-300">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
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
                                    {gasRequestCustomers.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.nic} - {user.name}
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
