import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Send, Users } from 'lucide-react';

const Communication = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([
        { id: 1, name: 'GBG User', role: 'user', phone: '1234561001', email: 'althaf.1035+gbg.user@gmail.com' },
        { id: 2, name: 'GBG Admin', role: 'admin', phone: '1234561002', email: 'althaf.1035+gbg.admin@gmail.com' },
        { id: 3, name: 'GBG Dispatch Admin', role: 'dispatch_admin', phone: '1234561003', email: 'althaf.1035+gbg.dispatch_admin@gmail.com' },
        { id: 4, name: 'GBG Outlet Manager', role: 'outlet_manager', phone: '1234561004', email: 'althaf.1035+gbg.outlet_manager@gmail.com' },
        { id: 5, name: 'GBG Business', role: 'business', phone: '1234561005', email: 'althaf.1035+gbg.business@gmail.com' }
    ]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [message, setMessage] = useState('');
    const [filterRole, setFilterRole] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/outlet/dashboard');
    };

    const handleSendMessage = () => {
        if (selectedContact && message.trim()) {
            alert(`Message sent to ${selectedContact.name}: ${message}`);
            setMessage('');
            setSelectedContact(null);
        }
    };

    const filteredContacts = filterRole
        ? contacts.filter((contact) => contact.role === filterRole)
        : contacts;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-100">
            <div className="fixed inset-0">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
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
                            Communication
                        </h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Role</label>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            >
                                <option value="">All Roles</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="dispatch_admin">Dispatch Admin</option>
                                <option value="outlet_manager">Outlet Manager</option>
                                <option value="business">Business</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
                                <h3 className="text-xl font-bold mb-4">Contact List</h3>
                                <div className="space-y-2">
                                    {filteredContacts.map((contact) => (
                                        <div
                                            key={contact.id}
                                            onClick={() => setSelectedContact(contact)}
                                            className={`p-4 rounded-xl cursor-pointer ${
                                                selectedContact?.id === contact.id
                                                    ? 'bg-blue-500/10 border border-blue-500/50'
                                                    : 'bg-gray-900/20 hover:bg-gray-900/30'
                                            }`}
                                        >
                                            <p className="text-gray-300">{contact.name}</p>
                                            <p className="text-sm text-gray-400">{contact.role}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="backdrop-blur-xl bg-gray-800/30 p-6 rounded-3xl shadow-2xl border border-gray-700/50">
                                <h3 className="text-xl font-bold mb-4">Compose Message</h3>
                                {selectedContact && (
                                    <div className="mb-4">
                                        <p className="text-gray-300">To: {selectedContact.name}</p>
                                        <p className="text-sm text-gray-400">{selectedContact.role}</p>
                                    </div>
                                )}
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                    rows="4"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!selectedContact || !message.trim()}
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                        border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <div className="fixed inset-0 pointer-events-none radial-gradient opacity-30" />
        </div>
    );
};

export default Communication;
