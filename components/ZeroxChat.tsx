// components/ZeroxChat.tsx
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
   content: "Hi! I'm Zerox, your AI coding companion. I specialize in rapid development and turning ideas into code. What shall we build?"
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
   <div className="w-96 h-[600px] bg-black rounded-lg shadow-xl border-2 border-[#6D56AC] flex flex-col transform transition-all duration-300 hover:shadow-2xl hover:shadow-[#6D56AC]/20">
     <div className="flex justify-between items-center p-4 border-b-2 border-[#6D56AC] bg-black/50 backdrop-blur">
       <h2 className="text-[#6D56AC] font-bold text-xl tracking-wide">Zerox AI</h2>
     </div>

     <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#6D56AC] scrollbar-track-black">
       {messages.map((msg, i) => (
         <div 
           key={i} 
           className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
         >
           <div 
             className={`max-w-[80%] rounded-lg p-3 transform transition-all duration-300 hover:scale-[1.02] ${
               msg.role === 'user' 
                 ? 'bg-[#6D56AC] text-white shadow-lg' 
                 : 'bg-[#1a1a1a] text-[#6D56AC] shadow-md'
             }`}
           >
             <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
           </div>
         </div>
       ))}
       {isLoading && (
         <div className="flex justify-start animate-pulse">
           <div className="bg-[#1a1a1a] text-[#6D56AC] rounded-lg p-3 shadow-md">
             <p className="text-sm">Thinking...</p>
           </div>
         </div>
       )}
       <div ref={messagesEndRef} />
     </div>

     <form onSubmit={handleSubmit} className="p-4 border-t-2 border-[#6D56AC] bg-black/50 backdrop-blur">
       <div className="flex gap-2">
         <input
           type="text"
           value={input}
           onChange={(e) => setInput(e.target.value)}
           placeholder="What would you like to build?"
           className="flex-1 bg-[#1a1a1a] text-[#6D56AC] rounded-lg px-4 py-2 border border-[#6D56AC] focus:outline-none focus:ring-2 focus:ring-[#6D56AC] focus:border-transparent placeholder-[#6D56AC]/50 transition-all duration-300"
         />
         <button
           type="submit"
           disabled={isLoading || !input.trim()}
           className="bg-[#6D56AC] text-white p-3 rounded-lg hover:bg-[#5D4A94] disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:hover:scale-100"
         >
           <Send className="w-5 h-5" />
         </button>
       </div>
     </form>
   </div>
 );
}