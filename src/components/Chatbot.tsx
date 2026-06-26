'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI assistant. How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const newMessages = [...messages, { id: Date.now(), text: inputValue, isBot: false }];
    setMessages(newMessages);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Thanks for reaching out! A member of our team will contact you soon. Please use the booking form to schedule a consultation.", 
        isBot: true 
      }]);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ 
              width: '350px', 
              height: '500px', 
              background: 'var(--color-bg-card)', 
              border: '1px solid var(--color-border)', 
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)' }}></div>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>AI Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.isBot ? 'flex-start' : 'flex-end' }}>
                  <div style={{ 
                    maxWidth: '85%', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    background: msg.isBot ? 'rgba(255,255,255,0.05)' : 'var(--color-accent)', 
                    color: msg.isBot ? 'var(--color-text-main)' : '#fff',
                    border: msg.isBot ? '1px solid var(--color-border)' : 'none',
                    fontSize: '0.9rem',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..." 
                style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', color: 'var(--color-text-main)', fontSize: '0.9rem', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '0 1rem', background: 'var(--color-text-main)', color: 'var(--color-bg-base)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          background: 'var(--color-text-main)', 
          color: 'var(--color-bg-base)', 
          border: 'none', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
        )}
      </button>

    </div>
  );
}
