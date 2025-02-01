// components/User/RequestHistory.jsx
import { useState } from 'react';
import { Package, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RequestHistory = ({ requests }) => {
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    const filteredRequests = requests.filter(request => {
        if (filter === 'all') return true;
        return request.status.toLowerCase() === filter;
    });

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50';
            case 'approved':
                return 'bg-green-500/10 text-green-400 border-green-500/50';
            case 'rejected':
                return 'bg-red-500/10 text-red-400 border-red-500/50';
            case 'completed':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/50';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-4 sm:mb-0">
                    Request History
                </h2>
                
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                            text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        <option value="all">All Requests</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                    </select>

                    <button
                        onClick={() => navigate('/request-gas')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                            hover:from-blue-600 hover:to-purple-700 text-white rounded-xl 
                            transition-all duration-200 flex items-center"
                    >
                        <Package className="w-4 h-4 mr-2" />
                        New Request
                    </button>
                </div>
            </div>

            {filteredRequests.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-900/50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Request ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Gas Type
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {filteredRequests.map((request) => (
                                <tr 
                                    key={request.id}
                                    className="hover:bg-gray-800/30 transition-colors"
                                >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                        #{request.id}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {request.gas_type}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {request.quantity}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadgeClass(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {new Date(request.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => navigate(`/request/${request.id}`)}
                                            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                                        >
                                            Details
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">No requests found</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {filter === 'all' 
                            ? 'Start by creating a new gas request'
                            : `No ${filter} requests found`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RequestHistory;
