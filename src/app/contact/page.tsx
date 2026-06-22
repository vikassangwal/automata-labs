'use client';
import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');
    
    try {
      const res = await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('Success! Our team will contact you shortly.');
        setFormData({ name: '', email: '', company: '' });
      } else {
        setStatus('Error submitting form. Please try again.');
      }
    } catch (error) {
      setStatus('Network error. Please try again later.');
    }
  };

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="container" style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 className="animate-slide-up" style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
          Contact Us
        </h1>
        <p className="animate-slide-up delay-1 text-gray" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-secondary)' }}>
          Ready to automate your operations? Drop us a line and our experts will build a custom strategy for you.
        </p>
      </div>

      <section className="section" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="minimal-card animate-slide-up delay-2" style={{ background: 'var(--color-bg-secondary)', padding: '3rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Full Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe" 
                style={{ width: '100%', padding: '1rem', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)', outline: 'none' }} 
              />
            </div>
            
            <div>
              <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Work Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@company.com" 
                style={{ width: '100%', padding: '1rem', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)', outline: 'none' }} 
              />
            </div>

            <div>
              <label style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Company Name</label>
              <input 
                type="text" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Acme Corp" 
                style={{ width: '100%', padding: '1rem', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)', outline: 'none' }} 
              />
            </div>

            {status && (
              <div style={{ padding: '1rem', background: status.includes('Success') ? '#e8f5e9' : 'var(--color-bg-primary)', color: status.includes('Success') ? '#2e7d32' : 'var(--color-text-primary)', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
                {status}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ padding: '1.2rem', borderRadius: '12px', fontSize: '1rem', marginTop: '1rem' }}>
              Request Consultation
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
