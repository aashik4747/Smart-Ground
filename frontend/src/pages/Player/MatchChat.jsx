import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import { useNotification } from "../../context/NotificationContext";

export default function MatchChat() {
    const { addNotification } = useNotification();
    const [message, setMessage] = useState("");
    // Mocking some initial messages for UI demonstration
    const [messages, setMessages] = useState([
        { id: 1, text: "Hey everyone! Is the match still on for 5 PM?", sender: "John Doe", isMe: false, time: "10:00 AM" },
        { id: 2, text: "Yes, I'll be there a bit early to warm up.", sender: "Jane Smith", isMe: false, time: "10:05 AM" },
        { id: 3, text: "Great! I'm bringing the kit.", sender: "You", isMe: true, time: "10:10 AM" },
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: message,
            sender: "You",
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setMessage("");
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-80px)]">
                {/* Chat Header */}
                <div className="bg-white p-4 rounded-t-2xl shadow-sm border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Match Chat</h2>
                        <p className="text-sm text-green-600 flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-grow bg-white p-6 overflow-y-auto space-y-4 shadow-sm border-x border-gray-100 scrollbar-thin scrollbar-thumb-gray-200">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-5 py-3 shadow-sm ${msg.isMe
                                    ? 'bg-indigo-600 text-white rounded-br-none'
                                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                {!msg.isMe && <p className="text-xs font-bold text-gray-500 mb-1">{msg.sender}</p>}
                                <p className="text-sm md:text-base">{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${msg.isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white p-4 rounded-b-2xl shadow-lg border-t border-gray-100">
                    <form onSubmit={sendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all border border-transparent focus:border-indigo-200"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors shadow-md flex-shrink-0"
                        >
                            <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
