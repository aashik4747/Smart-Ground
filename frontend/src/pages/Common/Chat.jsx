import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/common/DashboardLayout";
import useSocket from "../../hooks/useSocket";
import useAuth from "../../hooks/useAuth";

export default function Chat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState("");
    const socket = useSocket();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket) {
            socket.on("message", (newMessage) => {
                setMessages((prev) => [...prev, newMessage]);
            });
        }
        return () => {
            if (socket) socket.off("message");
        };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (socket && msg.trim()) {
            const messageData = {
                text: msg,
                sender: user?.name || "Anonymous",
                senderId: user?.id,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            socket.emit("sendMessage", messageData);
            // Optimistic update if needed, but socket usually broadcasts back
            // setMessages([...messages, { ...messageData, sender: "You" }]); 
            setMsg("");
        }
    };

    return (
        <DashboardLayout
            role={user?.role || "PLAYER"}
            title="Global Chat"
            description="Connect with other sports enthusiasts."
        >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-200px)] overflow-hidden animate-fade-in">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Community Chat</h3>
                            <p className="text-xs text-green-500 font-medium flex items-center">
                                <span className="block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                Online
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        messages.map((m, i) => {
                            const isMe = m.senderId === user?.id || m.sender === "me"; // Adjust based on actual backend msg structure
                            return (
                                <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-md ${isMe
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                                        }`}>
                                        <div className={`text-xs mb-1 font-bold ${isMe ? "text-indigo-200" : "text-indigo-600"}`}>
                                            {m.sender}
                                        </div>
                                        <p className="text-sm">{m.text}</p>
                                        <div className={`text-[10px] mt-1 text-right ${isMe ? "text-indigo-200" : "text-gray-400"}`}>
                                            {m.time}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={sendMessage} className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            disabled={!msg.trim()}
                            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md transform active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
