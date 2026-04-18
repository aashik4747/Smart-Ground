import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            // Initialize socket connection
            const socketInstance = io(window.location.origin, {
                path: "/socket.io",
                query: {
                    userId: user._id,
                    role: user.role,
                },
                reconnection: true,
            });

            setSocket(socketInstance);

            // Clean up listener on unmount
            return () => {
                socketInstance.disconnect();
                setSocket(null);
            };
        } else {
            // User logged out, close existing connection
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user]); // Re-run when user changes

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
