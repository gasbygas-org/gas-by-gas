import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Edit, Trash2, Search, Filter, ArrowLeft, Plus } from 'lucide-react';

const UserManagement = () => {
    const navigate = useNavigate();

    const users = [
        { id: 1, nic: '123451001V', name: 'GBG User', phone: '1234561001', email: 'althaf.1035+gbg.user@gmail.com', role: 'user', password: '11111111', address: 'address' },
        { id: 2, nic: '123451002V', name: 'GBG Admin', phone: '1234561002', email: 'althaf.1035+gbg.admin@gmail.com', role: 'admin', password: '11111111', address: 'address' },
        { id: 3, nic: '123451003V', name: 'GBG Dispatch Admin', phone: '1234561003', email: 'althaf.1035+gbg.dispatch_admin@gmail.com', role: 'dispatch_admin', password: '11111111', address: 'address' },
        { id: 4, nic: '123451004V', name: 'GBG Outlet Manager', phone: '1234561004', email: 'althaf.1035+gbg.outlet_manager@gmail.com', role: 'outlet_manager', password: '11111111', address: 'address' },
        { id: 5, nic: '123451005V', name: 'GBG Business', phone: '1234561005', email: 'althaf.1035+gbg.business@gmail.com', role: 'business', password: '11111111', address: 'address' }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newUser, setNewUser] = useState({
        role: '',
        nic: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        address: ''
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleEditUser = (userId) => {
        const user = users.find(u => u.id === userId);
        setSelectedUser(user);
        setNewUser({
            role: user.role,
            nic: user.nic,
            name: user.name,
            phone: user.phone,
            email: user.email,
            password: user.password,
            address: user.address
        });
        setIsModalOpen(true);
    };

    const handleDeleteUser = (userId) => {
        const user = users.find(u => u.id === userId);
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        console.log('Delete user:', selectedUser.id);
        setIsDeleteModalOpen(false);
    };

    const handleBackToDashboard = () => {
        navigate('/admin/dashboard');
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setNewUser({
            role: '',
            nic: '',
            name: '',
            phone: '',
            email: '',
            password: '',
            address: ''
        });
        setIsModalOpen(true);
    };

    const handleSaveUser = () => {
        if (selectedUser) {
            console.log('Update user:', selectedUser.id, newUser);
        } else {
            console.log('Add new user:', newUser);
        }
        setIsModalOpen(false);
    };

    const filteredUsers = users.filter(user => {
        return (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filterRole ? user.role === filterRole : true)
        );
    });

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
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50 mb-8">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Manage Users
                        </h2>

                        <div className="flex justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by name"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                    />
                                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                                <div className="relative">
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="bg-gray-700/50 border border-gray-600/50 rounded-xl pl-10 pr-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                    >
                                        <option value="">All Roles</option>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="dispatch_admin">Dispatch Admin</option>
                                        <option value="outlet_manager">Outlet Manager</option>
                                        <option value="business">Business</option>
                                    </select>
                                    <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                                </div>
                            </div>
                            <button
                                onClick={handleAddUser}
                                className="inline-flex items-center px-4 py-2 bg-green-500/10 text-green-400 
                                    border border-green-500/50 rounded-xl hover:bg-green-500/20 transition-all duration-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add New User
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-700/50">
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">NIC</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Phone</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Role</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/10 transition-colors duration-200">
                                            <td className="px-6 py-4 text-sm text-gray-300">{user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{user.nic}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{user.phone}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{user.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">{user.role}</td>
                                            <td className="px-6 py-4 text-sm text-gray-300">
                                                <button
                                                    onClick={() => handleEditUser(user.id)}
                                                    className="inline-flex items-center px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200 mr-2"
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="inline-flex items-center px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/20 transition-all duration-200"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800/90 p-8 rounded-3xl shadow-2xl border border-gray-700/50 w-1/3">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            {selectedUser ? 'Edit User' : 'Add New User'}
                        </h2>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-300 mb-1">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                >
                                    <option value="">Select Role</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="dispatch_admin">Dispatch Admin</option>
                                    <option value="outlet_manager">Outlet Manager</option>
                                    <option value="business">Business</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-300 mb-1">NIC</label>
                                <input
                                    type="text"
                                    value={newUser.nic}
                                    onChange={(e) => setNewUser({ ...newUser, nic: e.target.value })}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-300 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={newUser.phone}
                                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-300 mb-1">Address</label>
                                <input
                                    type="text"
                                    value={newUser.address}
                                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                                    className="bg-gray-700/50 border border-gray-600/50 rounded-xl px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 
                                        border border-red-500/50 rounded-xl hover:bg-red-500/20 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveUser}
                                    className="inline-flex items-center px-4 py-2 bg-green-500/10 text-green-400 
                                        border border-green-500/50 rounded-xl hover:bg-green-500/20 transition-all duration-200"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800/90 p-8 rounded-3xl shadow-2xl border border-gray-700/50 w-1/3">
                        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Confirm Deletion
                        </h2>
                        <p className="text-sm text-gray-300 mb-6">Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="inline-flex items-center px-4 py-2 bg-red-500/10 text-red-400 
                                    border border-red-500/50 rounded-xl hover:bg-red-500/20 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="inline-flex items-center px-4 py-2 bg-green-500/10 text-green-400 
                                    border border-green-500/50 rounded-xl hover:bg-green-500/20 transition-all duration-200"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default UserManagement;
