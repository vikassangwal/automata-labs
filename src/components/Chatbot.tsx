'use client';

import React, { useState } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! 🙏 Main aapki kaise madad kar sakta hoon?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { id: Date.now(), text: inputValue, isBot: false }];
    setMessages(newMessages);
    setInputValue("");

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Dhanyavaad! 🙌 Humari team jaldi aapse contact karegi. Aap neeche form bhi bhar sakte hain.", 
        isBot: true 
      }]);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
      
      {isOpen && (
        <div style={{ 
          width: '340px', height: '420px', 
          background: '#fff', 
          border: '1px solid #e5e5e5', 
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)'
        }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.25rem', background: '#2563eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.1rem' }}>💬</span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#fff' }}>Chat Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
                <div style={{ 
                  maxWidth: '80%', padding: '0.65rem 0.9rem', borderRadius: '12px', 
                  background: msg.isBot ? '#f3f4f6' : '#2563eb', 
                  color: msg.isBot ? '#1a1a1a' : '#fff',
                  fontSize: '0.9rem', lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '0.75rem', borderTop: '1px solid #eee', display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type karein..." 
              style={{ flex: 1, padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid #e5e5e5', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
            />
            <button type="submit" style={{ padding: '0 0.9rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem' }}>➤</button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '56px', height: '56px', borderRadius: '50%', 
          background: '#2563eb', color: '#fff', 
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.3)',
          fontSize: '1.5rem', transition: 'transform 0.2s'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
