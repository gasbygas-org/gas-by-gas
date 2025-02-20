import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Phone, Users } from 'lucide-react';
import API from '../../api/config';

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [gasRequests, setGasRequests] = useState([]);
    const [requestError, setRequestError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        // if (user && user.role === 'admin') {
            setAdminData(user);
            fetchUsers();
            fetchGasRequests();
        // } else {
            // navigate('/login');
        // }
    }, [navigate]);

    const fetchGasRequests = async () => {
        try {
            const response = await API.get('/user/gas/all-requests');
            if (response.data.success) {
                setGasRequests(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching gas requests:', error);
            setRequestError('Failed to load gas requests');
        }
    };

    const handleApproveRequest = async (requestId) => {
        try {
            const response = await API.post('/user/gas/approve', { 
                requestId,
                status: 'Approved' 
            });
            
            if (response.data.success) {
                // Refresh the requests list
                fetchGasRequests();
                toast.success('Request approved successfully');
            }
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Failed to approve request');
        }
    };
    
    const handleDeclineRequest = async (requestId) => {
        try {
            const response = await API.post('/user/gas/approve', { 
                requestId,
                status: 'Declined' 
            });
            
            if (response.data.success) {
                // Refresh the requests list
                fetchGasRequests();
                toast.success('Request declined successfully');
            }
        } catch (error) {
            console.error('Error declining request:', error);
            toast.error('Failed to decline request');
        }
    };
    
    

    const fetchUsers = async () => {
        try {
            console.log('1. Starting fetchUsers...');
            const response = await API.get('/admin/users/');
            console.log('2. Response received:', response.data);
            
            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('API Error Details:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config
            });
            setError(error.response?.data?.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };
    
    

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
            {/* Background pattern */}
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
            </div>

            {/* Main content */}
            <div className="relative">
                {/* Navigation */}
                <nav className="backdrop-blur-xl bg-gray-900/30 border-b border-gray-700/50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                    Admin Dashboard
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-300">{adminData?.name}</span>
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

                <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    {/* Admin Profile Card */}
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 mb-8">
                        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Admin Profile
                        </h2>
                        {adminData && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-300">
                                        <User className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{adminData.name}</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <Mail className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{adminData.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-300">
                                        <Phone className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{adminData.phone}</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <Users className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{adminData.nic}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Management Section */}
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            User Management
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {users.map((user) => (
                                            <tr key={user.id} className="bg-gray-900/20">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/50">
                                                        {user.role_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 text-xs rounded-full ${
                                                        user.is_verified 
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/50' 
                                                            : 'bg-red-500/10 text-red-400 border border-red-500/50'
                                                    }`}>
                                                        {user.is_verified ? 'Verified' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-4">
                                                        Edit
                                                    </button>
                                                    <button className="text-red-400 hover:text-red-300 transition-colors duration-200">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    {/* Gas Requests Section */}
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 mt-8">
                        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Gas Requests
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Request ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {gasRequests.map((request) => (
                                        <tr key={request.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">#{request.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.user_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.gas_type_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.quantity}</td>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.token}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {request.request_status === 'Pending' && (
                                                    <div className="flex gap-2">
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
                    </div>
                </main>
            </div>

            {/* Radial gradient for hover effects */}
            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default AdminDashboard;
