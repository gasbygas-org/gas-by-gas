import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ArrowLeft, Download, FileText, Users, Store, Package, Activity } from 'lucide-react';
import apiClient from '../../api/apiClient';

const Reports = () => {
    const navigate = useNavigate();
    const [activeReport, setActiveReport] = useState('request-history'); // Default to Request History Report
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Static data extracted from gasbygas.sql
    const users = [
        { id: 1, name: 'GBG User' },
        { id: 2, name: 'GBG Admin' },
        { id: 3, name: 'GBG Dispatch Admin' },
        { id: 4, name: 'GBG Outlet Manager' },
        { id: 5, name: 'GBG Business' }
    ];

    const outlets = [
        { id: 1, outlet_name: 'City Gas Outlet' },
        { id: 2, outlet_name: 'Suburban Gas Shop' },
        { id: 3, outlet_name: 'Kandy Gas Depot' }
    ];

    const gasTypes = [
        { id: 1, gas_type_name: '12.5 kg Domestic' },
        { id: 2, gas_type_name: '5 kg Domestic' },
        { id: 3, gas_type_name: '37.5 kg Commercial' }
    ];

    const [gasRequests, setGasRequests] = useState([]);
const [isLoading, setIsLoading] = useState(false); 
const [error, setError] = useState(null); 
const [totalPages, setTotalPages] = useState(1); 
const [currentPage, setCurrentPage] = useState(1); 
const requestsPerPage = 10;

const fetchGasRequests = async (page) => {
    setIsLoading(true);  
    setError(null);  
    try {
        const userId = JSON.parse(localStorage.getItem('user'))?.id; 
        const token = localStorage.getItem('token'); 
        const response = await apiClient.get(`/api/request/gas/requests`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                userId: userId,
                page: page, 
                pageSize: requestsPerPage, 
            },
        });

        const pagination = response.data.pagination;
        setGasRequests(response.data.data);
        setTotalPages(pagination.totalPages);
    } catch (error) {
        console.log(error);
        setError('Failed to fetch gas requests. Please try again later.');
    } finally {
        setIsLoading(false);
    }
};
useEffect(() => {
    fetchGasRequests(currentPage);
}, [currentPage]);



    const reportOptions = [
        { id: 'request-history', name: 'Request History', icon: FileText },
        // { id: 'notification-report', name: 'Notification Report', icon: Activity }
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleBackToDashboard = () => {
        navigate('/user/dashboard');
    };

    const handleDownloadReport = () => {
        let dataToDownload = [];
        let headers = [];

        if (activeReport === 'request-history') {
            headers = [
                'Request ID',
                'User Name',
                'Outlet Name',
                'Gas Type Name',
                'Quantity',
                'Request Status',
                'Delivery Date',
                'Created At',
                'Updated At'
            ];
            dataToDownload = requestHistory.map((request) => ({
                'Request ID': request.id,
                'User Name': users.find((user) => user.id === request.user_id)?.name || 'N/A',
                'Outlet Name': outlets.find((outlet) => outlet.id === request.outlet_id)?.outlet_name || 'N/A',
                'Gas Type Name': gasTypes.find((type) => type.id === request.gas_type_id)?.gas_type_name || 'N/A',
                'Quantity': request.quantity,
                'Request Status': request.request_status,
                'Delivery Date': request.delivery_date,
                'Created At': request.created_at,
                'Updated At': request.updated_at
            }));
        } else if (activeReport === 'notification-report') {
            headers = [
                'Notification ID',
                'Request ID',
                'User Name',
                'Message',
                'Notification Type',
                'Status',
                'Created At'
            ];
            dataToDownload = notificationReport.map((notification) => ({
                'Notification ID': notification.id,
                'Request ID': notification.request_id,
                'User Name': users.find((user) => user.id === notification.user_id)?.name || 'N/A',
                'Message': notification.message,
                'Notification Type': notification.notification_type,
                'Status': notification.status,
                'Created At': notification.created_at
            }));
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
        const filteredGasRequests = gasRequests.filter((request) => {
            const createdAt = new Date(request.created_at);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;
            return (!start || createdAt >= start) && (!end || createdAt <= end);
        });
    
        switch (activeReport) {
            case 'request-history':
                return (
                    <div className="backdrop-blur-xl bg-gray-800/30 p-8 rounded-3xl shadow-2xl border border-gray-700/50">
                        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                            Request History Report
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Request ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Outlet Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Gas Type Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Delivery Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Updated At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700/50">
                                    {filteredGasRequests.map((request) => (
                                        <tr key={request.id} className="bg-gray-900/20">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {users.find((user) => user.id === request.user_id)?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {outlets.find((outlet) => outlet.id === request.outlet_id)?.outlet_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {gasTypes.find((type) => type.id === request.gas_type_id)?.gas_type_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.request_status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.delivery_date}</td>
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
