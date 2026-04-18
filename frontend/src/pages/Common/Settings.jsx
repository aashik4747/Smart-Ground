import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/common/DashboardLayout";
import useAuth from "../../hooks/useAuth";
import { useNotification } from "../../context/NotificationContext";

export default function Settings() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const handleAction = (action) => {
        if (action === 'logout') {
            logout();
            navigate('/login');
        } else {
            addNotification(`Navigating to ${action}...`, "info");
        }
    };

    return (
        <DashboardLayout
            role={user?.role || "PLAYER"}
            title="Settings"
            description="Manage your account preferences and view important information."
        >
            <div className="max-w-3xl mx-auto animate-fade-in pb-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Section 1 */}
                    <div className="p-2">
                        <button onClick={() => handleAction('Privacy')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mr-4 group-hover:bg-indigo-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-gray-800">Privacy</span>
                            </div>
                            <span className="text-indigo-600 text-sm font-medium bg-indigo-50 px-3 py-1 rounded-full">Public</span>
                        </button>

                        <button onClick={() => handleAction('Account')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mr-4 group-hover:bg-indigo-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-gray-800">Account</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>

                    <div className="h-px bg-gray-100 w-full"></div>

                    {/* Section 2 */}
                    <div className="p-2">
                        <button onClick={() => handleAction('Past Bookings')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-gray-800">Past bookings</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        <button onClick={() => handleAction('Refunds')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h3m5-3v6a2 2 0 01-2 2h-3m4-13l-3 3m0 0l3 3m-3-3h8"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14l-3-3m0 0l-3 3m3-3v6"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-gray-800">Refunds</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        <button onClick={() => handleAction('Refund Methods')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-gray-800">Refund methods</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        <button onClick={() => handleAction('Support')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mr-4 group-hover:bg-blue-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M5.636 18.364a9 9 0 010-12.728m0 0l2.829 2.829M5.636 5.636L3 3m9 13a4 4 0 100-8 4 4 0 000 8z"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-gray-800">Support</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    </div>

                    <div className="h-px bg-gray-100 w-full"></div>

                    {/* Section 3 */}
                    <div className="p-2">
                        <button onClick={() => handleAction('Terms of Use')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mr-4 group-hover:bg-purple-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-gray-800">Terms of use</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        <button onClick={() => handleAction('Privacy Policy')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mr-4 group-hover:bg-purple-100 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-gray-800">Privacy Policy</span>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>

                        <button onClick={() => handleAction('logout')} className="w-full flex items-center justify-between p-4 mt-2 hover:bg-red-50 rounded-xl transition-colors group">
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-4 group-hover:bg-red-200 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                </div>
                                <span className="text-base font-semibold text-red-600">Logout</span>
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
