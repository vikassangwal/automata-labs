'use client';
import React, { useState } from 'react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', website: '', project: '', budget: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'contact_form' })
      });
      setSubmitted(true);
    } catch {
      alert('Failed to send message');
    }
    setSubmitting(false);
  };

  return (
    <section className="section" style={{ background: 'var(--color-primary-midnight)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          
          <div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Ready To <span className="text-gradient">Scale?</span></h2>
            <p className="text-gray" style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
              Drop us a line and let's build something extraordinary together.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button className="btn-primary" style={{ flex: 1, padding: '1rem' }}>Schedule Meeting</button>
              <button className="btn-secondary" style={{ flex: 1, padding: '1rem', borderColor: '#25D366', color: '#25D366' }}>WhatsApp Us</button>
            </div>
          </div>

          <div className="glass-card">
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#25D366' }}>Message Sent!</h3>
                <p className="text-gray">We will review your requirements and get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email" style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone" style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                  <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} placeholder="Company" style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="url" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="Website URL (e.g. https://yourdomain.com)" style={{ flex: 2, padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }} />
                  <select value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}>
                    <option value="">Budget</option>
                    <option value="$5k - $10k">$5k - $10k</option>
                    <option value="$10k - $25k">$10k - $25k</option>
                    <option value="$25k+">$25k+</option>
                  </select>
                </div>
                <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="What do you need? Tell us about your project requirements..." rows={4} style={{ padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', fontFamily: 'inherit', resize: 'none' }}></textarea>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '1rem', width: '100%', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
