import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

const ZeroxChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! I'm Zerox, your AI coding companion. I specialize in rapid development and turning ideas into code. What shall we build?"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "An error occurred. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-[#6D56AC] text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 transition-colors"
      >
        <span className="sr-only">Open Chat</span>
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] flex flex-col bg-black rounded-lg shadow-xl border border-[#6D56AC]">
      <div className="flex items-center justify-between p-4 border-b border-[#6D56AC]">
        <h2 className="text-[#6D56AC] font-bold">Zerox AI</h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-[#6D56AC] hover:opacity-80"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-[#6D56AC] text-white'
                  : 'bg-[#1a1a1a] text-[#6D56AC]'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1a1a1a] text-[#6D56AC] rounded-lg p-3">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-[#6D56AC]">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like to build?"
            className="flex-1 bg-[#1a1a1a] text-[#6D56AC] rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6D56AC] placeholder-[#6D56AC]/50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#6D56AC] text-white p-2 rounded hover:bg-opacity-90 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ZeroxChat;