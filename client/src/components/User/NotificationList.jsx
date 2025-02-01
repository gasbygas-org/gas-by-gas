// components/User/NotificationList.jsx
import { X, Bell } from 'lucide-react';

const NotificationList = ({ notifications, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
                {/* Background overlay */}
                <div 
                    className="absolute inset-0 bg-gray-900/75 transition-opacity" 
                    aria-hidden="true"
                    onClick={onClose}
                />

                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <div className="pointer-events-auto w-screen max-w-md">
                        <div className="flex h-full flex-col backdrop-blur-xl bg-gray-800/90 shadow-xl">
                            <div className="px-4 py-6 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-200 flex items-center">
                                        <Bell className="w-5 h-5 mr-2" />
                                        Notifications
                                    </h2>
                                    <button
                                        type="button"
                                        className="rounded-md text-gray-400 hover:text-gray-200"
                                        onClick={onClose}
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <div className="divide-y divide-gray-700">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div 
                                                key={notification.id} 
                                                className={`p-4 ${!notification.read ? 'bg-blue-500/5' : ''}`}
                                            >
                                                <div className="flex items-start">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-200">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(notification.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-gray-400">
                                            No new notifications
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationList;
