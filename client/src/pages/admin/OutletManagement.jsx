import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Plus, Edit, Trash } from 'lucide-react';

const OutletManagement = () => {
    const navigate = useNavigate();

    const users = [
        { id: 1, name: 'GBG User', role: 'user' },
        { id: 2, name: 'GBG Admin', role: 'admin' },
        { id: 3, name: 'GBG Dispatch Admin', role: 'dispatch_admin' },
        { id: 4, name: 'GBG Outlet Manager', role: 'outlet_manager' },
        { id: 5, name: 'GBG Business', role: 'business' }
    ];

    const [outlets, setOutlets] = useState([
        { id: 1, outlet_name: 'City Gas Outlet', address: '10 Station Road, Colombo', district: 'Colombo', phone: '0112777333', manager_id: 4 },
        { id: 2, outlet_name: 'Suburban Gas Shop', address: '25 High Street, Dehiwala', district: 'Colombo', phone: '0112888444', manager_id: 4 },
        { id: 3, outlet_name: 'Kandy Gas Depot', address: '5 Temple Road, Kandy', district: 'Kandy', phone: '0812999555', manager_id: 4 }
    ]);

    const [selectedOutlet, setSelectedOutlet] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
    const [newOutlet, setNewOutlet] = useState({ outlet_name: '', address: '', district: '', phone: '', manager_id: '' });
    const [error, setError] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/admin/dashboard');
    };

    const validateForm = () => {
        const { outlet_name, address, district, phone, manager_id } = newOutlet;
    
        // Validate outlet_name
        if (!outlet_name) {
            setError('Outlet Name is required.');
            return false;
        }
    
        // Validate address
        if (!address) {
            setError('Address is required.');
            return false;
        }
    
        // Validate district
        if (!district) {
            setError('District is required.');
            return false;
        }
    
        // Validate phone
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone) {
            setError('Phone number is required.');
            return false;
        } else if (!phoneRegex.test(phone)) {
            setError('Phone number should be 10 digits.');
            return false;
        }
    
        // Validate manager_id
        if (!manager_id) {
            setError('Manager must be selected.');
            return false;
        }
    
        setError('');
        return true;
    };
    

    const handleAddOutlet = () => {
        if (!validateForm()) return;

        setOutlets([...outlets, { id: outlets.length + 1, ...newOutlet }]);
        setNewOutlet({ outlet_name: '', address: '', district: '', phone: '', manager_id: '' });
        setIsModalOpen(false);
    };

    const handleEditOutlet = () => {
        if (!validateForm()) return;

        setOutlets(outlets.map((outlet) => (outlet.id === selectedOutlet.id ? newOutlet : outlet)));
        setIsModalOpen(false);
        setSelectedOutlet(null);
    };

    const handleDeleteOutlet = () => {
        setOutlets(outlets.filter((outlet) => outlet.id !== selectedOutlet.id));
        setIsDeleteConfirmationOpen(false);
        setSelectedOutlet(null);
    };

    const openModal = (outlet = null) => {
        if (outlet) {
            setSelectedOutlet(outlet);
            setNewOutlet(outlet);
        } else {
            setNewOutlet({ outlet_name: '', address: '', district: '', phone: '', manager_id: '' });
        }
        setIsModalOpen(true);
    };

    const openDeleteConfirmation = (outlet) => {
        setSelectedOutlet(outlet);
        setIsDeleteConfirmationOpen(true);
    };

    return (
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
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Outlet Management
                        </h2>
                        <div className="mb-6">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                    border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Outlet
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Outlet Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">District</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Manager</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {outlets.map((outlet) => (
                                        <tr key={outlet.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.outlet_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.district}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {users.find((user) => user.id === outlet.manager_id)?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openModal(outlet)}
                                                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mr-4"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteConfirmation(outlet)}
                                                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-xl bg-gray-900/50 flex items-center justify-center p-4">
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            {selectedOutlet ? 'Edit Outlet' : 'Add Outlet'}
                        </h3>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Outlet Name"
                                value={newOutlet.outlet_name}
                                onChange={(e) => setNewOutlet({ ...newOutlet, outlet_name: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={newOutlet.address}
                                onChange={(e) => setNewOutlet({ ...newOutlet, address: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="District"
                                value={newOutlet.district}
                                onChange={(e) => setNewOutlet({ ...newOutlet, district: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="Phone"
                                value={newOutlet.phone}
                                onChange={(e) => setNewOutlet({ ...newOutlet, phone: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            />
                            <select
                                value={newOutlet.manager_id}
                                onChange={(e) => setNewOutlet({ ...newOutlet, manager_id: e.target.value })}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            >
                                <option value="">Select Manager</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedOutlet ? handleEditOutlet : handleAddOutlet}
                                className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20"
                            >
                                {selectedOutlet ? 'Update' : 'Add'}
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
                        <p className="text-gray-300">Are you sure you want to delete this outlet?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteConfirmationOpen(false)}
                                className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteOutlet}
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

export default OutletManagement;
