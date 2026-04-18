import { createContext, useState, useContext, useCallback } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addNotification = useCallback((msg, type = "info", duration = 3000) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message: msg, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {notifications.map((note) => (
                    <div
                        key={note.id}
                        className={`px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 animate-slide-in flex items-center justify-between min-w-[300px] ${note.type === "error" ? "bg-red-500" :
                            note.type === "success" ? "bg-green-500" :
                                "bg-indigo-600"
                            }`}
                    >
                        <span>{note.message}</span>
                        <button
                            onClick={() => removeNotification(note.id)}
                            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);

