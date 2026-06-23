'use client';
import React, { useEffect, useState } from 'react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setServices(data.filter((s: any) => s.status === 'Active'));
      })
      .catch(err => console.error(err));
  }, []);

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
          source: 'services_page'
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
    <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 className="animate-slide-up" style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
          Our <span className="text-gradient">Services</span>
        </h1>
        <p className="animate-slide-up delay-1 text-gray" style={{ fontSize: '1.2rem', maxWidth: '600px', color: 'var(--color-text-secondary)', margin: '0 auto' }}>
          Comprehensive automation and engineering solutions designed to scale your enterprise operations seamlessly.
        </p>
      </div>

      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          {services.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
              No services available yet. Admin needs to add them.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {services.map((service, index) => (
                <div 
                  key={service.id || index} 
                  className={`glass-card hover:scale-105 animate-slide-up delay-${(index % 3) + 1}`} 
                  style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'transform 0.3s' }}>
                  
                  {service.imageUrl ? (
                    <div style={{ height: '220px', width: '100%', overflow: 'hidden' }}>
                      <img src={service.imageUrl} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ padding: '2rem 2rem 0 2rem' }}>
                      <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-accent-blue)' }}></div>
                      </div>
                    </div>
                  )}

                  <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, background: 'var(--color-bg-primary)' }}>
                    <h3 style={{ fontSize: '1.5rem' }}>{service.title}</h3>
                    <p style={{ color: 'var(--color-text-secondary)', flex: 1 }}>{service.description}</p>
                    
                    <button 
                      onClick={() => setSelectedService(service.title)}
                      className="btn-primary" 
                      style={{ width: '100%', marginTop: 'auto', padding: '0.8rem' }}>
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedService && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-card" style={{ width: '90%', maxWidth: '500px', padding: '2rem', position: 'relative', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>
            <button onClick={() => setSelectedService(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--color-text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Get {selectedService}</h3>
            {success ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#25D366' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                <h3>Request Sent!</h3>
                <p>Our AI will draft a personalized proposal and we will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input type="text" placeholder="Your Name" required value={name} onChange={e => setName(e.target.value)} style={{ padding: '1rem', borderRadius: '8px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', width: '100%', outline: 'none' }} />
                <input type="email" placeholder="Your Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '1rem', borderRadius: '8px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', width: '100%', outline: 'none' }} />
                <textarea placeholder="What exactly are you looking for?" required value={requirements} onChange={e => setRequirements(e.target.value)} rows={4} style={{ padding: '1rem', borderRadius: '8px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)', width: '100%', resize: 'none', outline: 'none' }}></textarea>
                <button type="submit" className="btn-primary" disabled={submitting} style={{ padding: '1rem', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Sending...' : 'Request Service'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
