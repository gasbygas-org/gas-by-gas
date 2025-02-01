// components/User/TokenCard.jsx
import { Clock, Calendar, MapPin, Check, AlertCircle } from 'lucide-react';

const TokenCard = ({ token }) => {
    if (!token) return null;

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-500/10 text-green-400 border-green-500/50';
            case 'expired':
                return 'bg-red-500/10 text-red-400 border-red-500/50';
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/50';
        }
    };

    return (
        <div className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                    Active Token
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(token.status)}`}>
                    {token.status}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                        <Check className="w-5 h-5 mr-2 text-blue-400" />
                        <span>Token: #{token.token_number}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                        <span>Delivery: {new Date(token.delivery_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        <span>Valid until: {new Date(token.pickup_deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                        <span>Outlet: {token.outlet_name}</span>
                    </div>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Important Notice</h3>
                    <p className="text-sm text-gray-400">
                        Please bring your empty cylinder and payment when collecting your gas.
                        Token expires on {new Date(token.pickup_deadline).toLocaleDateString()}.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TokenCard;
