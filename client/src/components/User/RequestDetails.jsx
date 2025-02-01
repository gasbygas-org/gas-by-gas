// pages/User/RequestDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Package, Calendar, MapPin, 
    Clock, AlertCircle, CheckCircle, XCircle 
} from 'lucide-react';
import API from '../../api/config';

const RequestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRequestDetails = async () => {
            try {
                const response = await API.get(`/user/gas/requests/${id}`);
                setRequest(response.data.request);
            } catch (error) {
                console.error('Error fetching request details:', error);
                setError('Failed to load request details');
            } finally {
                setLoading(false);
            }
        };

        fetchRequestDetails();
    }, [id]);

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-400" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-400" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 text-gray-300 hover:text-white transition-colors flex items-center"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
                    </div>
                ) : error ? (
                    <div className="text-red-400 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
                        {error}
                    </div>
                ) : request && (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                Request Details #{request.id}
                            </h1>
                            <div className="flex items-center">
                                {getStatusIcon(request.status)}
                                <span className={`ml-2 text-sm ${
                                    request.status === 'approved' ? 'text-green-400' :
                                    request.status === 'rejected' ? 'text-red-400' :
                                    request.status === 'pending' ? 'text-yellow-400' :
                                    'text-gray-400'
                                }`}>
                                    {request.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-300">
                                    <Package className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>Gas Type: {request.gas_type}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <Calendar className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-gray-300">
                                    <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                                    <span>Outlet: {request.outlet_name}</span>
                                </div>
                            </div>

                            {request.token && (
                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                                    <h3 className="text-sm font-medium text-gray-300 mb-2">Token Information</h3>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-400">
                                            Token Number: #{request.token.token_number}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Valid Until: {new Date(request.token.pickup_deadline).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {request.status === 'rejected' && request.rejection_reason && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                                <h3 className="text-sm font-medium text-red-400 mb-1">Rejection Reason</h3>
                                <p className="text-sm text-gray-400">{request.rejection_reason}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestDetails;
