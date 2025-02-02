// pages/OutletManagerDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api/config';
import { toast } from 'react-hot-toast';

export default function OutletManagerDashboard() {
    const [gasRequests, setGasRequests] = useState([]);
    const [outletInfo, setOutletInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOutletInfo();
        fetchGasRequests();
    }, []);

    const fetchOutletInfo = async () => {
        try {
            const response = await API.get('/outlet/manager/info');
            if (response.data.success) {
                setOutletInfo(response.data.outlet);
            }
        } catch (error) {
            console.error('Error fetching outlet info:', error);
            setError('Failed to load outlet information');
        }
    };

    const fetchGasRequests = async () => {
        try {
            const response = await API.get('/gas/all-requests');
            if (response.data.success) {
                setGasRequests(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            const response = await API.post(`/outlet/manager/requests/${requestId}/approve`);
            if (response.data.success) {
                toast.success('Request approved successfully');
                fetchGasRequests();
            }
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Failed to approve request');
        }
    };

    const handleDeclineRequest = async (requestId) => {
        try {
            const response = await API.post(`/outlet/manager/requests/${requestId}/decline`);
            if (response.data.success) {
                toast.success('Request declined successfully');
                fetchGasRequests();
            }
        } catch (error) {
            console.error('Error declining request:', error);
            toast.error('Failed to decline request');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Outlet Manager Dashboard
                </h1>

                {/* Outlet Info Section */}
                {outletInfo && (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 mb-8">
                        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Outlet Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm text-gray-400">Outlet Name</label>
                                <p className="text-lg">{outletInfo.outlet_name}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Address</label>
                                <p className="text-lg">{outletInfo.address}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-400">Contact</label>
                                <p className="text-lg">{outletInfo.phone}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gas Requests Section */}
                <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Gas Requests
                    </h2>

                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : error ? (
                        <div className="text-red-400 text-center py-4">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Request ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {gasRequests.map((request) => (
                                        <tr key={request.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                #{request.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {request.user_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {request.gas_type_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {request.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 text-xs rounded-full ${
                                                    request.request_status === 'Pending' 
                                                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/50'
                                                        : request.request_status === 'Approved'
                                                        ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                                                        : 'bg-red-500/10 text-red-400 border border-red-500/50'
                                                }`}>
                                                    {request.request_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {new Date(request.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {request.request_status === 'Pending' && (
                                                    <div className="flex space-x-4">
                                                        <button 
                                                            onClick={() => handleApproveRequest(request.id)}
                                                            className="text-green-400 hover:text-green-300 transition-colors duration-200"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeclineRequest(request.id)}
                                                            className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
