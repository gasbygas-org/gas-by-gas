import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Download, Activity } from 'lucide-react';

const Reports = () => {
    const navigate = useNavigate();
    const [activeReport, setActiveReport] = useState('outlet-performance');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Static data extracted from gasbygas.sql
    const outletRequests = [
        { id: 1, gas_type: '12.5 kg Domestic', requested_quantity: 20, approved_quantity: 20, delivery_date: '2025-02-10', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52', status: 'Approved' },
        { id: 2, gas_type: '5 kg Domestic', requested_quantity: 15, approved_quantity: 15, delivery_date: '2025-02-05', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52', status: 'Delivered' },
        { id: 3, gas_type: '37.5 kg Commercial', requested_quantity: 25, approved_quantity: 25, delivery_date: '2025-01-30', created_at: '2025-01-29 18:25:52', updated_at: '2025-01-29 18:25:52', status: 'Pending' }
    ];

    const reportOptions = [
        { id: 'outlet-performance', name: 'Outlet Performance', icon: Activity }
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/outlet/dashboard');
    };

    const handleDownloadReport = () => {
        let dataToDownload = [];
        let headers = [];

        switch (activeReport) {
            case 'outlet-performance':
                headers = ['Request ID', 'Requested Gas Type', 'Requested Quantity', 'Approved Quantity', 'Delivery Date', 'Status', 'Created At', 'Updated At'];
                dataToDownload = outletRequests.map((request) => ({
                    'Request ID': request.id,
                    'Requested Gas Type': request.gas_type,
                    'Requested Quantity': request.requested_quantity,
                    'Approved Quantity': request.approved_quantity,
                    'Delivery Date': request.delivery_date,
                    'Status': request.status,
                    'Created At': request.created_at,
                    'Updated At': request.updated_at
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
        const filteredRequests = outletRequests.filter((request) => {
            const createdAt = new Date(request.created_at);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            const statusMatch = statusFilter === 'all' || request.status.toLowerCase() === statusFilter.toLowerCase();
            return (!start || createdAt >= start) && (!end || createdAt <= end) && statusMatch;
        });

        switch (activeReport) {
            case 'outlet-performance':
                return (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Outlet Performance Report
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
                            {/* <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl"
                            >
                                <option value="all">All</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="delivered">Delivered</option>
                            </select> */}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Request ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requested Gas Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Requested Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Approved Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Delivery Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredRequests.map((request) => (
                                        <tr key={request.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.gas_type}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.requested_quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.approved_quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.delivery_date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.created_at}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.updated_at}</td>
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

    return (
        <div className="flex h-screen bg-gray-900">
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

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {renderReportContent()}
                </div>
            </div>
        </div>
    );
};

export default Reports;
