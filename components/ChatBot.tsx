import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy María 🍔. ¿En qué te puedo ayudar hoy? ¿Buscas una recomendación?' }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    const newHistory: ChatMessage[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newHistory);
    setIsLoading(true);

    // Call API
    const reply = await sendMessageToGemini(newHistory, userMessage);
    
    setMessages([...newHistory, { role: 'model', text: reply }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-110 shadow-orange-600/30 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Chat Assistant"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-80 sm:w-96 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-50 flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-slate-950 text-white p-4 rounded-t-2xl flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-1.5 rounded-full">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Asistente María</h3>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> En línea
              </span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-orange-600 text-white rounded-br-none'
                    : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3">
                <Loader2 size={16} className="animate-spin text-orange-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-900 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta por recomendaciones..."
              className="flex-1 bg-slate-800 text-white placeholder-slate-500 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 border border-slate-700"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatBot;