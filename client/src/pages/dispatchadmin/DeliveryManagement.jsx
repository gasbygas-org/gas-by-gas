import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Plus, Edit, Trash, Search, Filter, Loader2 } from 'lucide-react';
import { m } from 'framer-motion';
import AnimatedAlert from '../../components/AnimatedAlert';
import apiClient from '../../api/apiClient';

const DeliveryManagement = () => {
    const navigate = useNavigate();

    // Static data extracted from gasbygas.sql
    const deliveryRequests = [
        { id: 1, outlet: 'City Gas Outlet', gasType: '12.5 kg Domestic', quantity: 100, status: 'Pending', requestedOn: '2025-01-29 23:55:10' },
        { id: 2, outlet: 'Suburban Gas Shop', gasType: '5 kg Domestic', quantity: 50, status: 'Approved', requestedOn: '2025-01-28 23:55:10' },
        { id: 3, outlet: 'Kandy Gas Depot', gasType: '37.5 kg Commercial', quantity: 50, status: 'Delivered', requestedOn: '2025-01-27 23:55:10' },
    ];

    const searchRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [newDelivery, setNewDelivery] = useState({ outlet: '', gasType: '', quantity: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [gasRequests, setGasRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [outlets, setOutlets] = useState([]);
    const [gasTypes, setGasTypes] = useState([]);

    const requestsPerPage = 10;

    const fetchGasRequests = async (page) => {
        setIsLoading(true);
        setStatusMessage({ type: '', message: '' });
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            const response = await apiClient.get(`/api/stock/request/all-gas-requests`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page: page,
                    limit: requestsPerPage,
                    query: searchQuery,
                    status: filterStatus,
                },
            });
            // console.log(response);

            // const pagination = response.data.pagination;

            // setStatusMessage({
            //     type: 'success',
            //     message: 'Gas requests fetched!'
            // });

            setGasRequests(response.data.gasRequests);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(error);
            setStatusMessage({
                type: 'error',
                message: /*error.message || */'Failed to fetch gas requests!'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const setStatusMessage = (status, timeout = 3000) => {
        setStatus(status);
        setTimeout(() => {
            setStatus({ type: '', message: '' });
        }, timeout);
    }

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

    const fetchOutlets = async () => {
        try {
            const response = await apiClient.get('/api/outlet', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOutlets(response.data);
        } catch (err) {
            console.error('Error fetching outlets:', err);
        }
    };

    const fetchGasTypes = async () => {
        try {
            const response = await apiClient.get('/api/gas-types/all', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // console.log(response);            
            setGasTypes(response.data);
        } catch (err) {
            console.error('Error fetching gas types:', err);
        }
    };

    useEffect(() => {
        fetchGasRequests(1);
        fetchOutlets();
        fetchGasTypes();
    }, []);

    useEffect(() => {
        if (searchRef.current) {
            searchRef.current.focus();
        }
    }, [gasRequests])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 1500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        fetchGasRequests(1);
    }, [debouncedQuery, filterStatus]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/dispatch/dashboard');
    };

    const handleApproveRequest = async () => {
        // const updatedRequests = deliveryRequests.map(request =>
        //     request.id === selectedRequest.id ? { ...request, status: 'Approved' } : request
        // );
        // setDeliveryRequests(updatedRequests);
        await approveRequest();
        await fetchGasRequests(1);
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const approveRequest = async () => {
        setIsLoading(true);
        setStatusMessage({ type: '', message: '' });
        try {
            // console.log(selectedRequest);
            const token = localStorage.getItem('token');
            await apiClient.patch(`/api/stock/request/status`, {
                outletId: selectedRequest.outlet_id,
                requestId: selectedRequest.id,
                gasAmount: newDelivery.quantity,
                status: "Approved"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchGasRequests(currentPage);
            setStatusMessage({ type: 'success', message: 'Request approved successfully!' });
        } catch (error) {
            setStatusMessage({ type: 'error', message: error.response?.data?.message || 'Approval failed' });
        } finally {
            setIsLoading(false);
        }
        // setIsModalOpen(false);
    };

    const handleRejectRequest = async () => {
        // setDeliveryRequests(deliveryRequests.filter(request => request.id !== selectedRequest.id));
        await rejectRequest();
        await fetchGasRequests(1);
        setIsDeleteConfirmationOpen(false);
        setSelectedRequest(null);
    };

    const rejectRequest = async () => {
        setIsLoading(true);
        setStatusMessage({ type: '', message: '' });
        try {
            const token = localStorage.getItem('token');
            await apiClient.patch(`/api/stock/request/${selectedRequest.id}/cancel`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchGasRequests(currentPage);
            setStatusMessage({ type: 'success', message: 'Request rejected successfully!' });
        } catch (error) {
            setStatusMessage({ type: 'error', message: error.response?.data?.message || 'Rejection failed' });
        } finally {
            setIsLoading(false);
        }
        // setIsDeleteConfirmationOpen(false);
    };

    const handleScheduleDelivery = () => {
        setDeliveryRequests([...deliveryRequests, { id: deliveryRequests.length + 1, ...newDelivery, status: 'Pending', requestedOn: new Date().toISOString() }]);
        setNewDelivery({ outlet: '', gasType: '', quantity: '' });
        setIsModalOpen(false);
    };

    const openModal = (request = null) => {
        if (request) {
            setSelectedRequest(request);
            setNewDelivery(request);
            // console.log(request, newDelivery);
        } else {
            setNewDelivery({ outlet: '', gasType: '', quantity: '' });
        }
        setIsModalOpen(true);
    };

    const openDeleteConfirmation = (request) => {
        setSelectedRequest(request);
        setIsDeleteConfirmationOpen(true);
    };

    // const filteredRequests = deliveryRequests.filter(request => {
    //     return (
    //         request.outlet.toLowerCase().includes(searchQuery.toLowerCase()) &&
    //         (filterStatus ? request.status === filterStatus : true)
    //     );
    // });

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
                                Delivery Management
                            </h2>
                            {/* <div className="mb-6">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                    border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Schedule New Delivery
                            </button>
                        </div> */}
                            <div className="flex justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <input
                                            ref={searchRef}
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
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                        >
                                            <option value="">All Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Outlet</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requested On</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {gasRequests.map((request) => {
                                            const disableApprove = request.request_status !== 'Pending';
                                            const disableApproveStyle = disableApprove ? 'opacity-50 cursor-not-allowed' : '';
                                            const disableReject = request.request_status !== 'Pending';
                                            const disableRejectStyle = disableReject ? 'opacity-50 cursor-not-allowed' : '';

                                            return (
                                                <tr key={request.id} className="bg-gray-900/20">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.outlet}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.gas_type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.request_status}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.created_at}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            disabled={disableApprove}
                                                            onClick={() => openModal(request)}
                                                            className={`text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-4
                                                                ${disableApproveStyle}`}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            disabled={disableReject}
                                                            onClick={() => openDeleteConfirmation(request)}
                                                            className={`text-red-400 hover:text-red-300 transition-colors duration-200
                                                                ${disableRejectStyle}`}
                                                        >
                                                            <Trash className="w-4 h-4" />
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

                {isModalOpen && (
                    <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                        <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                {selectedRequest ? 'Approve Request' : 'Schedule New Delivery'}
                            </h3>
                            <div className="space-y-4">
                                <select
                                    value={newDelivery.outlet_id}
                                    onChange={(e) => setNewDelivery({ ...newDelivery, outlet: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                >
                                    <option value="">Select Outlet</option>
                                    {outlets.map(outlet => (
                                        <option key={outlet.id} value={outlet.id}>{outlet.outlet_name}</option>
                                    ))}
                                </select>

                                <select
                                    value={newDelivery.gas_type_id}
                                    onChange={(e) => setNewDelivery({ ...newDelivery, gasType: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                >
                                    <option value="">Select Gas Type</option>
                                    {gasTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.gas_type_name}</option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    value={newDelivery.quantity}
                                    onChange={(e) => setNewDelivery({ ...newDelivery, quantity: e.target.value })}
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
                                    onClick={selectedRequest ? handleApproveRequest : handleScheduleDelivery}
                                    className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                                >
                                    {selectedRequest ? 'Approve' : 'Schedule'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isDeleteConfirmationOpen && (
                    <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                        <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                Confirm Rejection
                            </h3>
                            <p className="text-gray-300">Are you sure you want to reject this request?</p>
                            <div className="mt-6 flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsDeleteConfirmationOpen(false)}
                                    className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectRequest}
                                    className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
            </div>
    );
};

export default DeliveryManagement;
