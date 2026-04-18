import DashboardLayout from "../../components/common/DashboardLayout";
import { useNotification } from "../../context/NotificationContext";
import useAuth from "../../hooks/useAuth";

export default function Notifications() {
    const { notifications, removeNotification } = useNotification();
    const { user } = useAuth();

    return (
        <DashboardLayout
            role={user?.role || "PLAYER"}
            title="Notifications"
            description="Stay updated with your latest activities."
        >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Recent Alerts</h3>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                        {notifications.length} New
                    </span>
                </div>

                <div className="divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                            <p className="mt-1 text-sm text-gray-500">You're all caught up! Check back later for updates.</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div key={n.id} className={`p-6 hover:bg-gray-50 transition-colors flex items-start group ${n.type === 'error' ? 'bg-red-50/30' : ''}`}>
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4 ${n.type === 'error' ? 'bg-red-100 text-red-600' :
                                        n.type === 'success' ? 'bg-green-100 text-green-600' :
                                            'bg-blue-100 text-blue-600'
                                    }`}>
                                    {n.type === 'error' ? (
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    ) : n.type === 'success' ? (
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                        {n.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Just now</p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                    <button
                                        onClick={() => removeNotification(n.id)}
                                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
