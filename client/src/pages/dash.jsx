return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
        {/* Background pattern */}
        <div className="fixed inset-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
        </div>
        
        <div className="relative">
            {/* Navigation */}
            <nav className="backdrop-blur-xl bg-gray-900/30 border-b border-gray-700/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                User Dashboard
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                            >
                                <Bell className="w-6 h-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 transform translate-x-1 -translate-y-1" />
                                )}
                            </button>
                            
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

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {userData && (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Welcome, {userData.name}
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Profile Information */}
                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
                                <h3 className="text-xl font-semibold mb-4 text-gray-200">
                                    Profile Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center text-gray-300">
                                        <User className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{userData.name}</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <Mail className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{userData.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <Phone className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{userData.phone}</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <CreditCard className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{userData.nic}</span>
                                    </div>
                                    <div className="flex items-center text-gray-300">
                                        <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                                        <span>{userData.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Gas Requests Section */}
                            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-200">
                                        My Gas Requests
                                    </h3>
                                    <Link 
                                        to="/request-gas"
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                                            hover:from-blue-600 hover:to-purple-700 text-white rounded-xl 
                                            transition-all duration-200"
                                    >
                                        Request Gas
                                    </Link>

                                </div>
                                
                                {loading ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                                    </div>
                                ) : requests.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-900/50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                                                        ID
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                                                        Gas Type
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                                                        Status
                                                    </th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700/50">
                                                {requests.map((request) => (
                                                    <tr key={request.id} className="hover:bg-gray-800/30 transition-colors">
                                                        <td className="px-4 py-3 text-sm text-gray-300">
                                                            #{request.id}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-300">
                                                            {request.gas_type}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                request.status === 'approved' 
                                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/50'
                                                                    : request.status === 'pending'
                                                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/50'
                                                                    : 'bg-red-500/10 text-red-400 border border-red-500/50'
                                                            }`}>
                                                                {request.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-300">
                                                            {new Date(request.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center py-4">
                                        No gas requests found. Create your first request!
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>

        {/* Radial gradient for hover effects */}
        <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
    </div>
);