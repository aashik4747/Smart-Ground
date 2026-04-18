import { useSocket as useSocketContext } from "../context/SocketContext";

const useSocket = () => {
    const context = useSocketContext();
    return context?.socket || null;
};

export default useSocket;
