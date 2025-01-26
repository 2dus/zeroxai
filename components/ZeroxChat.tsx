"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export default function ZeroxChat() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi! I'm Zerox, your AI coding companion. Let's build something amazing!"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "An error occurred. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black rounded-lg border-2 border-[#6D56AC] flex flex-col h-[600px] shadow-xl shadow-[#6D56AC]/10">
      <div className="flex justify-between items-center p-4 border-b-2 border-[#6D56AC]">
        <h2 className="text-[#6D56AC] font-bold text-xl">Zerox AI</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${
              msg.role === 'user' 
                ? 'bg-[#6D56AC] text-white' 
                : 'bg-[#1a1a1a] text-[#6D56AC]'
            }`}>
              <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-[#1a1a1a] text-[#6D56AC] rounded-lg p-3">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t-2 border-[#6D56AC]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like to build?"
            className="flex-1 bg-[#1a1a1a] text-[#6D56AC] rounded-lg px-4 py-2 border border-[#6D56AC] focus:outline-none focus:ring-2 focus:ring-[#6D56AC]"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-[#6D56AC] text-white p-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}