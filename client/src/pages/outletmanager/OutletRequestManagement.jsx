import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Plus, Edit, Trash, Loader2 } from 'lucide-react';
import { m } from 'framer-motion';
import AnimatedAlert from '../../components/AnimatedAlert';
import apiClient from '../../api/apiClient';

const OutletRequestManagement = () => {
    const navigate = useNavigate();

    // const gasTypes = [
    //     { id: 1, gasType: '12.5 kg Domestic' },
    //     { id: 2, gasType: '5 kg Domestic' },
    //     { id: 3, gasType: '37.5 kg Commercial' },
    // ];

    // const [outletRequests, setOutletRequests] = useState([
    //     { id: 1, gasType: '12.5 kg Domestic', quantity: 20, status: 'Pending', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52' },
    //     { id: 2, gasType: '5 kg Domestic', quantity: 15, status: 'Approved', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52' },
    //     { id: 3, gasType: '37.5 kg Commercial', quantity: 10, status: 'Delivered', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52' }
    // ]);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({ gasType: '', quantity: '', status: 'Pending' });
    const [gasRequests, setGasRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [gasTypes, setGasTypes] = useState([]);

    const requestsPerPage = 10;

    const fetchGasRequests = async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            const response = await apiClient.get(`/api/stock/request/filter-gas-requests`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    outletId: user.outletId,
                    page: page,
                    limit: requestsPerPage,
                },
            });
            // console.log(response);

            setGasRequests(response.data.gasRequests);
            setTotalPages(response.data.totalPages);
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
        setStatusMessage({ type: '', message: '' });
        try {
            const token = localStorage.getItem('token');
            const response = await apiClient.patch(
                `/api/stock/request/${requestId}/cancel`,
                // { requestStatus: 'Cancelled' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setStatusMessage({
                type: 'success',
                message: 'Gas request cancelled!'
            });
            // console.log(response);
        } catch (error) {
            console.log(error);
            setError('Failed to cancel gas request. Please try again later.');
            setStatusMessage({
                type: 'error',
                message: /*error.message || */'Failed to cancel gas request!'
            });
        } finally {
            setIsLoading(false);
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
        fetchGasTypes();
        // fetchGasRequestCustomers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/outlet/dashboard');
    };

    const addRequest = async () => {
        setIsLoading(true);
        setError('');
        setStatusMessage({ type: '', message: '' });
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await apiClient.post(
                '/api/stock/request/gas',
                {
                    outletId: user.outletId,
                    requestStatus: newRequest.status,
                    gasTypeId: newRequest.gasType,
                    quantity: newRequest.quantity,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            // console.log(response);
            setStatusMessage({
                type: 'success',
                message: 'Gas request created!'
            });
            // alert('Gas request submitted successfully!');
            // navigate('/outlet/outlet-requests');
        } catch (err) {
            console.log(err);
            setError('Failed to submit request. Please try again.');
            setStatusMessage({
                type: 'error',
                message: /*error.message || */'Failed to create gas request!'
            });
        } finally {
            setIsLoading(false)
        }
    };

    const handleAddRequest = async () => {
        // console.log(newRequest); return;
        // setOutletRequests([...outletRequests, { id: outletRequests.length + 1, ...newRequest, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]);
        await addRequest();
        await fetchGasRequests(1);
        setNewRequest({ gasType: '', quantity: '', status: 'Pending' });
        setIsModalOpen(false);
    };

    const handleEditRequest = () => {
        setOutletRequests(outletRequests.map((request) => (request.id === selectedRequest.id ? { ...newRequest, updated_at: new Date().toISOString() } : request)));
        setIsModalOpen(false);
        setSelectedRequest(null);
    };

    const handleDeleteRequest = async (id) => {
        // console.log('selected', id);
        // return;        
        // setOutletRequests(outletRequests.filter((request) => request.id !== selectedRequest.id));
        await cancelGasRequest(id);
        await fetchGasRequests(1);
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {gasRequests.map((request) => {
                                            const disableCancel = request.request_status !== 'Pending';
                                            const disableCancelStyle = disableCancel ? 'opacity-50 cursor-not-allowed' : '';

                                            return (
                                                <tr key={request.id} className="bg-gray-900/20">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.gas_type}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.quantity}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.request_status}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.created_at}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.updated_at}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {/* <button
                                                        onClick={() => openModal(request)}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-4"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button> */}
                                                        <button
                                                            disabled={disableCancel}
                                                            onClick={() => openDeleteConfirmation(request)}
                                                            className={`text-red-400 hover:text-red-300 transition-colors duration-200 
                                                                ${disableCancelStyle}`}
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
                                        <option key={gas.id} value={gas.id}>
                                            {gas.gas_type_name}
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
                                    onClick={() => handleDeleteRequest(selectedRequest.id)}
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
