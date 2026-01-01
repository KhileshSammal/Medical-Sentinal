
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Shield, Phone, Calendar, Clock, Check, MoreHorizontal, UserPlus } from 'lucide-react';
import { ConciergeMessage } from '../types';

const Concierge: React.FC = () => {
  const [messages, setMessages] = useState<ConciergeMessage[]>([
    {
      id: '1',
      sender: 'QUARTERMASTER',
      text: 'Good evening, Khilesh. Senior Nurse Anjali here. I noticed the AI flagged a slight Vitamin D malabsorption trend in your last genetic sync. How are you feeling today?',
      timestamp: '20:15'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: ConciergeMessage = {
      id: Date.now().toString(),
      sender: 'USER',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SENT'
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    // Mock response
    setTimeout(() => {
      const response: ConciergeMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'QUARTERMASTER',
        text: 'Understood. I have already coordinated with Dr. Sharma. Your supplement schedule has been optimized in the app. Would you like me to book a follow-up lab collection for next Tuesday?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[70vh] glass rounded-[2.5rem] border-white/10 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lime-500 border-2 border-[#0A0A0B] shadow-[0_0_8px_rgba(132,204,22,0.6)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Medical Quartermaster</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-lime-400 font-bold uppercase">Anjali (Senior Nurse)</span>
              <span className="text-[10px] text-neutral-500 font-medium tracking-tighter">• Online</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-3 glass rounded-xl border-white/10 hover:bg-white/5 transition-colors text-neutral-400 hover:text-white">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-3 glass rounded-xl border-white/10 hover:bg-white/5 transition-colors text-neutral-400 hover:text-white">
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] space-y-1 ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'USER' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg indigo-glow' 
                  : 'glass border-white/10 text-neutral-300 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1.5 px-1">
                <span className="text-[9px] text-neutral-600 font-bold uppercase">{msg.timestamp}</span>
                {msg.sender === 'USER' && <Check className="w-2.5 h-2.5 text-indigo-400" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/10 bg-white/[0.01]">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Ask your Quartermaster..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm text-white outline-none focus:border-indigo-500/50 transition-all placeholder:text-neutral-600"
            />
            <button 
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl indigo-glow hover:bg-indigo-500 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <button className="p-4 glass rounded-2xl border-white/10 hover:bg-indigo-600/10 hover:border-indigo-500/30 transition-all text-neutral-400 hover:text-indigo-400 group">
            <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <p className="mt-4 text-[9px] text-center text-neutral-600 uppercase font-bold tracking-[0.2em]">
          Priority 1: Encryption Secured by Sovereign Ledger
        </p>
      </div>
    </div>
  );
};

export default Concierge;
