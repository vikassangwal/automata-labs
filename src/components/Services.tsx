'use client';
import React, { useState } from 'react';

const services = [
  { id: 1, title: 'Custom Websites', desc: 'High-converting, visually stunning web experiences.' },
  { id: 2, title: 'AI Chatbots', desc: 'Intelligent conversational agents available 24/7.' },
  { id: 3, title: 'AI Agents', desc: 'Autonomous systems that perform complex business tasks.' },
  { id: 4, title: 'Workflow Automation', desc: 'Eliminate manual work with seamless integrations.' },
  { id: 5, title: 'CRM Development', desc: 'Custom tailored CRMs powered by predictive AI.' },
  { id: 6, title: 'Lead Generation', desc: 'Automated systems to capture and nurture leads.' },
  { id: 7, title: 'Appointment Booking', desc: 'Smart scheduling that prevents double bookings.' },
  { id: 8, title: 'Business Automation', desc: 'End-to-end automation of your operational processes.' },
  { id: 9, title: 'AI Integrations', desc: 'Connect OpenAI, Anthropic, and other models.' },
  { id: 10, title: 'SaaS Development', desc: 'Scalable cloud software architecture and development.' }
];

export default function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);
    try {
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email,
          message: `Interested in: ${selectedService}\nRequirements: ${requirements}`,
          source: 'service_click'
        })
      });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setSelectedService(null); }, 3000);
    } catch {
      alert('Error submitting request');
    }
    setSubmitting(false);
  };

  return (
    <section id="services" className="section" style={{ position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our <span className="text-gradient">Services</span></h2>
          <p className="text-gray" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            We build cutting-edge solutions designed to scale your business and automate your growth. Click any service to get started.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          {services.map(service => (
            <div 
              key={service.id} 
              onClick={() => setSelectedService(service.title)}
              className="glass-card hover:scale-105" 
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', transition: 'transform 0.3s' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px', 
                background: 'rgba(0, 229, 255, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-accent-blue)' }}></div>
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>{service.title}</h3>
              <p className="text-gray" style={{ fontSize: '0.95rem' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedService && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button onClick={() => setSelectedService(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Get {selectedService}</h3>
            {success ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#25D366' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                <h3>Request Sent!</h3>
                <p>Our AI will draft a personalized proposal and we will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Your Name" required value={name} onChange={e => setName(e.target.value)} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%' }} />
                <input type="email" placeholder="Your Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%' }} />
                <textarea placeholder="What exactly are you looking for?" required value={requirements} onChange={e => setRequirements(e.target.value)} rows={4} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%', resize: 'none' }}></textarea>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ padding: '1rem', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Sending...' : 'Request Service'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
