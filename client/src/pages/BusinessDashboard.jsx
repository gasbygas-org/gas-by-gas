// pages/BusinessDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../api/config';
import { toast } from 'react-hot-toast';
import { Upload } from 'lucide-react';

export default function BusinessDashboard() {
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [certification, setCertification] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
        fetchRequests();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await API.get('/business/profile');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('Failed to load user data');
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await API.get('/user/gas/requests');
            if (response.data.success) {
                setRequests(response.data.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleCertificationUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('certification', file);

            const response = await API.post('/business/upload-certification', formData);
            if (response.data.success) {
                toast.success('Business certification uploaded successfully');
                fetchUserData(); // Refresh user data to get updated certification
            }
        } catch (error) {
            console.error('Error uploading certification:', error);
            toast.error('Failed to upload certification');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Business Dashboard
                </h1>

                {/* Profile Section */}
                <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 mb-8">
                    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Business Profile
                    </h2>
                    
                    {user && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-400">Name</p>
                                <p className="text-lg">{user.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Email</p>
                                <p className="text-lg">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Phone</p>
                                <p className="text-lg">{user.phone}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">NIC</p>
                                <p className="text-lg">{user.nic}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-gray-400">Address</p>
                                <p className="text-lg">{user.address}</p>
                            </div>
                            
                            {/* Business Certification Section */}
                            <div className="md:col-span-2">
                                <p className="text-gray-400 mb-2">Business Certification</p>
                                {user.certification_url ? (
                                    <div className="flex items-center gap-4">
                                        <a 
                                            href={user.certification_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                                        >
                                            View Current Certification
                                        </a>
                                        <label className="cursor-pointer text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200">
                                            Update
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={handleCertificationUpload}
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/50 rounded-xl hover:bg-purple-500/20 transition-all duration-200">
                                        <Upload size={20} />
                                        Upload Certification
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleCertificationUpload}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Gas Requests Section */}
                <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Gas Requests
                        </h2>
                        <button
                            onClick={() => navigate('/request-gas')}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            New Request
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : error ? (
                        <div className="text-red-400 text-center py-4">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Token</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Delivery Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Pickup Period</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {requests.map((request) => (
                                        <tr key={request.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {request.token}
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
                                                {new Date(request.delivery_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {new Date(request.pickup_period_start).toLocaleDateString()} - {new Date(request.pickup_period_end).toLocaleDateString()}
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
