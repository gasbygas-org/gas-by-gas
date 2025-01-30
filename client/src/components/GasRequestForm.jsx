import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertCircle, Info } from 'lucide-react';
import API from '../api/config';

const GasRequestForm = () => {
    const [stockInfo, setStockInfo] = useState({});
    const [checking, setChecking] = useState(false);
    const [stockError, setStockError] = useState('');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        gasTypeId: '',
        quantity: 1,
        outletId: ''
    });
    const [outlets, setOutlets] = useState([]);
    const [gasTypes, setGasTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const checkStock = async (outletId, gasTypeId, quantity) => {
        if (!outletId || !gasTypeId || !quantity) return;
        
        try {
            setChecking(true);
            setStockError('');
            
            console.log('Checking stock params:', { outletId, gasTypeId, quantity });
            
            const response = await API.get(`/outlets/${outletId}/stock`, {
                params: { gasTypeId, quantity }
            });
    
            console.log('Stock check response:', response.data);
            console.log('Is available:', response.data.isAvailable);
            
            setStockInfo(response.data);
            return response.data.isAvailable;
        } catch (error) {
            console.error('Stock check error:', error);
            setStockError(error.response?.data?.message || 'Failed to check stock');
            return false;
        } finally {
            setChecking(false);
        }
    };
    
    

    useEffect(() => {
        const { outletId, gasTypeId, quantity } = formData;
        if (outletId && gasTypeId && quantity) {
            checkStock(outletId, gasTypeId, quantity);
        }
    }, [formData.outletId, formData.gasTypeId, formData.quantity]);

    // Fetch outlets and gas types
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch outlets
                const outletsResponse = await API.get('/outlets');
                setOutlets(outletsResponse.data.outlets || []); // Add .outlets and fallback
        
                // Fetch gas types
                const gasTypesResponse = await API.get('/gas-types');
                setGasTypes(gasTypesResponse.data.gasTypes || []); // Add .gasTypes and fallback
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load required data');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const isAvailable = await checkStock(
                formData.outletId, 
                formData.gasTypeId, 
                formData.quantity
            );

            if (!isAvailable) {
                setError('Selected quantity is not available at this outlet');
                return;
            }

            const response = await API.post('/user/gas', {
                ...formData,
                requestStatus: 'pending',
                deliveryDate: new Date().toISOString().split('T')[0]
            });

            if (response.data.success) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error creating request:', error);
            setError(error.response?.data?.message || 'Failed to create request');
        } finally {
            setLoading(false);
        }
    };

    const StockInfo = ({ info }) => {
        // Add console.log to debug the incoming data
        console.log('Stock Info:', info);
    
        if (!info || !info.success) return null;
    
        return (
            <div className={`mt-2 px-3 py-2 rounded-lg text-sm flex items-center ${
                info.isAvailable 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                    : 'bg-red-500/10 text-red-400 border border-red-500/50'
            }`}>
                <Info className="w-4 h-4 mr-2" />
                {info.isAvailable 
                    ? `${info.availableQuantity} cylinders available`
                    : `Only ${info.availableQuantity} cylinders available`}
            </div>
        );
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12 px-4 sm:px-6 lg:px-8">
            {/* Background pattern */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
            </div>

            <div className="max-w-md mx-auto">
                <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                    <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Request Gas
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center text-red-400">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Gas Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Gas Type
                            </label>
                            <select
                                value={formData.gasTypeId}
                                onChange={(e) => setFormData({...formData, gasTypeId: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                    text-gray-200"
                                required
                            >
                                <option value="">Select Gas Type</option>
                                {gasTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name} - {type.weight}kg
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.quantity}
                                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                    text-gray-200"
                                required
                            />
                            {checking ? (
                                <div className="mt-2 text-blue-400 text-sm flex items-center">
                                    <div className="w-4 h-4 border-t-2 border-b-2 border-current rounded-full animate-spin mr-2" />
                                    Checking availability...
                                </div>
                            ) : (
                                <StockInfo info={stockInfo} />
                            )}
                        </div>

                        {/* Outlet Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Select Outlet
                            </label>
                            <select
                                value={formData.outletId}
                                onChange={(e) => setFormData({...formData, outletId: e.target.value})}
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                    text-gray-200"
                                required
                            >
                                <option value="">Select an Outlet</option>
                                {outlets.map((outlet) => (
                                    <option key={outlet.id} value={outlet.id}>
                                        {outlet.name} - {outlet.district}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || checking || !stockInfo?.isAvailable}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 
                                hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium 
                                transition-all duration-200 focus:outline-none focus:ring-2 
                                focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Submit Request'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default GasRequestForm;
