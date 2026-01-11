'use client';

import { useState, useEffect, useRef } from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 'welcome',
                    text: 'Xin chào! 👋 Tôi là trợ lý ảo của BayNhanh. Tôi có thể giúp bạn:\n\n✈️ Tư vấn chuyến bay\n💰 So sánh giá vé\n🏖️ Gợi ý điểm đến\n📝 Hướng dẫn đặt vé\n\nBạn cần tôi hỗ trợ điều gì?',
                    sender: 'bot',
                    timestamp: new Date(),
                },
            ]);
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: `user_${Date.now()}`,
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5000/chatbot/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    message: inputText,
                }),
            });

            const data = await response.json();

            const botMessage: Message = {
                id: `bot_${Date.now()}`,
                text: data.message,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = {
                id: `error_${Date.now()}`,
                text: 'Xin lỗi, tôi đang gặp chút vấn đề. Vui lòng thử lại! 🙏',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputText(suggestion.replace(/^[✈️💰🏖️📝🎒]\s*/, ''));
    };

    const suggestions = [
        '✈️ Gợi ý điểm đến du lịch tháng này',
        '💰 So sánh giá vé Hà Nội - Sài Gòn',
        '🏖️ Du lịch Phú Quốc nên đi vào tháng mấy?',
        '📝 Hướng dẫn đặt vé như thế nào?',
    ];

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }`}
            >
                {isOpen ? (
                    <span className="text-3xl text-white">✕</span>
                ) : (
                    <span className="text-3xl">💬</span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                            🤖
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-lg">BayNhanh AI</h3>
                            <p className="text-xs text-blue-100">Trợ lý ảo thông minh</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                                    <p
                                        className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                                            }`}
                                    >
                                        {message.timestamp.toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Suggestions (show only when no messages) */}
                        {messages.length === 1 && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 text-center">Gợi ý câu hỏi:</p>
                                {suggestions.map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 transition"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập câu hỏi của bạn..."
                                className="flex-1 border-2 border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500 text-gray-900 placeholder-gray-400"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputText.trim() || isTyping}
                                className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="text-xl">➤</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
