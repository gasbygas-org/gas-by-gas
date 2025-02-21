import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Check, X, Truck, Loader2 } from 'lucide-react';
import { m } from 'framer-motion';
import apiClient from '../../api/apiClient';

const GasRequests = () => {
    const navigate = useNavigate();

    const [gasRequests, setGasRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isCancelConfirmationOpen, setIsCancelConfirmationOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const requestsPerPage = 5;

    const fetchGasRequests = async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            const userId = JSON.parse(localStorage.getItem('user'))?.id;
            const token = localStorage.getItem('token');
            const response = await apiClient.get(`/api/request/gas/requests`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    userId: userId,
                    page: page,
                    pageSize: requestsPerPage,
                },
            });

            const pagination = response.data.pagination;

            setGasRequests(response.data.data);
            setTotalPages(pagination.totalPages);
        } catch (error) {
            console.log(error);
            setError('Failed to fetch gas requests. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const cancelGasRequest = async (requestId) => {
        setIsLoading(true);
        setError(null);
        try {
            const userId = JSON.parse(localStorage.getItem('user'))?.id;
            const token = localStorage.getItem('token');
            const response = await apiClient.post(`/api/request/gas/cancel`, 
                { requestId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            await fetchGasRequests(1); // refresh the list after cancellation
        } catch (error) {
            console.log(error);
            setError('Failed to cancel gas request. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGasRequests(1);
    }, []);

    const handleCancel = async (id) => {
        setIsCancelConfirmationOpen(false);
        await cancelGasRequest(id);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/user/dashboard');
    };

    const openCancelConfirmation = (request) => {
        setSelectedRequest(request);
        setIsCancelConfirmationOpen(true);
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
                <Loader2 className="w-12 h-12 text-blue-500" />
            </m.div>
        </div>
    );

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-500 text-yellow-900';
            case 'Approved':
                return 'bg-green-500 text-green-900';
            case 'Delivered':
                return 'bg-blue-500 text-blue-900';
            default:
                return 'bg-gray-500 text-gray-900';
        }
    };

    return (
        isLoading ? 
        <LoadingScreen /> :
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
            </div>

            {/* Header and Navigation */}
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

            {/* Main Content */}
            <div className="relative">
                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Gas Requests
                        </h2>
                        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                            {gasRequests.map((request) => {
                                const requestedOn = new Date(request.created_at).toLocaleDateString('en-CA');
                                const deliveryDate = new Date(request.delivery_date).toLocaleDateString('en-CA');
                                const pickupStart = new Date(request.pickup_period_start).toLocaleDateString('en-CA');
                                const pickupEnd = new Date(request.pickup_period_end).toLocaleDateString('en-CA');

                                return (
                                    <div key={request.id} className="flex justify-between p-4 bg-gray-900/20 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <div className="text-xl font-semibold">{request.gas_type}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm text-gray-300">Outlet: {request.outlet}</div>
                                                <div className="text-sm text-gray-300">Quantity: {request.quantity}</div>
                                                <div className={`text-sm ${getStatusColor(request.request_status)}`}>
                                                    Status: {request.request_status}
                                                </div>
                                                <div className="text-sm text-gray-300">
                                                    <span className="font-semibold">Token:</span> 
                                                    <span className="bg-gray-800 px-2 py-1 rounded-md text-gray-400">{request.token}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm text-gray-300">Requested On: {requestedOn}</div>
                                                <div className="text-sm text-gray-300">Delivery Date: {deliveryDate}</div>
                                                <div className="text-sm text-gray-300">
                                                    Pickup Period: {pickupStart} - {pickupEnd}
                                                </div>
                                            </div>
                                        </div>
                                        {request.request_status === 'Pending' && (
                                            <div className="mt-4 flex items-center space-x-2">
                                                <button
                                                    onClick={() => openCancelConfirmation(request)}
                                                    className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20 transition-all duration-200"
                                                >
                                                    <X className="w-4 h-4 mr-2" />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination Controls */}
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

            {/* Cancel Confirmation Modal */}
            {isCancelConfirmationOpen && (
                <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Confirm Cancellation
                        </h3>
                        <p className="text-gray-300">Are you sure you want to cancel this request?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsCancelConfirmationOpen(false)}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                            >
                                No, Go Back
                            </button>
                            <button
                                onClick={() => handleCancel(selectedRequest.id)}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default GasRequests;
