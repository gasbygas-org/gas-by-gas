// client\src\pages\admin\Reports.jsx
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Download, FileText, Users, Store, Package, Activity } from 'lucide-react';
import API from '../../api/config';


const Reports = () => {
    const navigate = useNavigate();
    const [activeReport, setActiveReport] = useState('user-registration');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [users, setUsers] = useState([]);  // State to store fetched users
    const [loading, setLoading] = useState(false);  // State to handle loading state
    const [error, setError] = useState(null);  // State to handle errors

    // Fetch users data from API when component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);  // Set loading to true before API call
            try {
                const response = await API.get('user/users/all');
                setUsers(response.data);  // Update state with API response
            } catch (err) {
                setError('Failed to fetch users data');  // Handle error if API call fails
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);  // Set loading to false after API call
            }
        };

        fetchUsers();
    }, []);  // Empty dependency array means this runs once when component mounts


    const outlets = [
        { id: 1, outlet_name: 'City Gas Outlet', address: '10 Station Road, Colombo', district: 'Colombo', phone: '0112777333', manager_id: 4, created_at: '2025-01-29 18:25:10', updated_at: '2025-01-30 08:38:37' },
        { id: 2, outlet_name: 'Suburban Gas Shop', address: '25 High Street, Dehiwala', district: 'Colombo', phone: '0112888444', manager_id: 4, created_at: '2025-01-29 18:25:10', updated_at: '2025-01-30 08:38:40' },
        { id: 3, outlet_name: 'Kandy Gas Depot', address: '5 Temple Road, Kandy', district: 'Kandy', phone: '0812999555', manager_id: 4, created_at: '2025-01-29 18:25:10', updated_at: '2025-01-30 08:38:44' }
    ];

    const stocks = [
        { id: 1, outlet_id: 1, gas_type_id: 1, quantity: 50, created_at: '2025-01-29 18:25:45', updated_at: '2025-01-29 18:25:45' },
        { id: 2, outlet_id: 1, gas_type_id: 2, quantity: 30, created_at: '2025-01-29 18:25:45', updated_at: '2025-01-29 18:25:45' },
        { id: 3, outlet_id: 1, gas_type_id: 3, quantity: 20, created_at: '2025-01-29 18:25:45', updated_at: '2025-01-29 18:25:45' }
    ];

    const auditLogs = [
        { id: 1, user_id: 1, action: 'INSERT', table_affected: 'outlets', record_id: 4, old_values: null, new_values: '{"phone": "0112345678", "address": "New Address", "district": "New District", "manager_id": 2, "outlet_name": "New Outlet"}', timestamp: '2025-01-29 18:26:30' },
        { id: 2, user_id: 2, action: 'UPDATE', table_affected: 'deliveries', record_id: 1, old_values: '{"status": "Scheduled"}', new_values: '{"status": "In Transit"}', timestamp: '2025-01-29 18:26:30' }
    ];

    const reportOptions = [
        { id: 'user-registration', name: 'User Registration', icon: Users },
        { id: 'outlet-management', name: 'Outlet Management', icon: Store },
        { id: 'stock-management', name: 'Stock Management', icon: Package },
        { id: 'system-activity', name: 'System Activity', icon: Activity }
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/admin/dashboard');
    };

    const handleDownloadReport = () => {
        let dataToDownload = [];
        let headers = [];

        switch (activeReport) {
            case 'user-registration':
                headers = ['User ID', 'Name', 'NIC', 'Phone', 'Email', 'Address', 'Role Name', 'Created At', 'Updated At'];
                dataToDownload = users.map((user) => ({
                    'User ID': user.id,
                    'Name': user.name,
                    'NIC': user.nic,
                    'Phone': user.phone,
                    'Email': user.email,
                    'Address': user.address,
                    'Role Name': user.role_name,
                    'Created At': user.created_at,
                    'Updated At': user.updated_at
                }));
                break;
            case 'outlet-management':
                headers = ['Outlet ID', 'Outlet Name', 'Address', 'District', 'Phone', 'Manager Name', 'Created At', 'Updated At'];
                dataToDownload = outlets.map((outlet) => ({
                    'Outlet ID': outlet.id,
                    'Outlet Name': outlet.outlet_name,
                    'Address': outlet.address,
                    'District': outlet.district,
                    'Phone': outlet.phone,
                    'Manager Name': users.find((user) => user.id === outlet.manager_id)?.name || 'N/A',
                    'Created At': outlet.created_at,
                    'Updated At': outlet.updated_at
                }));
                break;
            case 'stock-management':
                headers = ['Stock ID', 'Outlet Name', 'Gas Type Name', 'Stock Count', 'Created At', 'Updated At'];
                dataToDownload = stocks.map((stock) => ({
                    'Stock ID': stock.id,
                    'Outlet Name': outlets.find((outlet) => outlet.id === stock.outlet_id)?.outlet_name || 'N/A',
                    'Gas Type Name': ['12.5 kg Domestic', '5 kg Domestic', '37.5 kg Commercial'][stock.gas_type_id - 1] || 'N/A',
                    'Stock Count': stock.quantity,
                    'Created At': stock.created_at,
                    'Updated At': stock.updated_at
                }));
                break;
            case 'system-activity':
                headers = ['Audit Log ID', 'User\'s Name', 'Action', 'Table Affected', 'Record ID', 'Old Values', 'New Values', 'Timestamp'];
                dataToDownload = auditLogs.map((log) => ({
                    'Audit Log ID': log.id,
                    'User\'s Name': users.find((user) => user.id === log.user_id)?.name || 'N/A',
                    'Action': log.action,
                    'Table Affected': log.table_affected,
                    'Record ID': log.record_id,
                    'Old Values': log.old_values || 'N/A',
                    'New Values': log.new_values || 'N/A',
                    'Timestamp': log.timestamp
                }));
                break;
            default:
                break;
        }

        const csvContent = [
            headers.join(','),
            ...dataToDownload.map((row) => headers.map((header) => row[header]).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${activeReport}-report.csv`;
        link.click();
    };

    const renderReportContent = () => {
        const filteredUsers = users.filter((user) => {
            const createdAt = new Date(user.created_at);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || createdAt >= start) && (!end || createdAt <= end);
        });

        const filteredOutlets = outlets.filter((outlet) => {
            const createdAt = new Date(outlet.created_at);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || createdAt >= start) && (!end || createdAt <= end);
        });

        const filteredStocks = stocks.filter((stock) => {
            const createdAt = new Date(stock.created_at);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || createdAt >= start) && (!end || createdAt <= end);
        });

        const filteredAuditLogs = auditLogs.filter((log) => {
            const timestamp = new Date(log.timestamp);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || timestamp >= start) && (!end || timestamp <= end);
        });

        switch (activeReport) {
            case 'user-registration':
                return (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            User Registration Report
                        </h2>
                        <div className="mb-6 flex items-center space-x-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                placeholder="Start Date"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                placeholder="End Date"
                            />
                            <button
                                onClick={handleDownloadReport}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                    border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">NIC</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.nic}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.created_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.updated_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'outlet-management':
                return (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Outlet Management Report
                        </h2>
                        <div className="mb-6 flex items-center space-x-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                placeholder="Start Date"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                placeholder="End Date"
                            />
                            <button
                                onClick={handleDownloadReport}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                    border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Outlet ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Outlet Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">District</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Manager Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredOutlets.map((outlet) => (
                                        <tr key={outlet.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.outlet_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.district}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {users.find((user) => user.id === outlet.manager_id)?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.created_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{outlet.updated_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'stock-management':
                return (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Stock Management Report
                        </h2>
                        <div className="mb-6 flex items-center space-x-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                placeholder="Start Date"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                placeholder="End Date"
                            />
                            <button
                                onClick={handleDownloadReport}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                    border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Outlet Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock Count</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredStocks.map((stock) => (
                                        <tr key={stock.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {outlets.find((outlet) => outlet.id === stock.outlet_id)?.outlet_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {['12.5 kg Domestic', '5 kg Domestic', '37.5 kg Commercial'][stock.gas_type_id - 1] || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.created_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.updated_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'system-activity':
                return (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            System Activity Report
                        </h2>
                        <div className="mb-6 flex items-center space-x-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                placeholder="Start Date"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                                placeholder="End Date"
                            />
                            <button
                                onClick={handleDownloadReport}
                                className="inline-flex items-center px-4 py-2 bg-blue-500/10 text-blue-400 
                                    border border-blue-500/50 rounded-xl hover:bg-blue-500/20 transition-all duration-200"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Audit Log ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User's Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Table Affected</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredAuditLogs.map((audit) => (
                                        <tr key={audit.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{audit.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {users.find((user) => user.id === audit.user_id)?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{audit.action}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{audit.table_affected}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{audit.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return <div>Select a report to view</div>;
        }
    };

    // return <div>{renderReportContent()}</div>;

    return (
        <div className="flex h-screen bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 p-6 flex flex-col">
                <div className="flex items-center mb-8">
                    <button
                        onClick={handleBackToDashboard}
                        className="flex items-center text-gray-300 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                    </button>
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-300 mb-4">Reports</h2>
                    <nav className="space-y-2">
                        {reportOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => setActiveReport(option.id)}
                                className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors ${activeReport === option.id
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <option.icon className="w-5 h-5 mr-3" />
                                {option.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-300 hover:text-white mt-auto"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {renderReportContent()}
                </div>
            </div>
        </div>
    );
};

export default Reports;
