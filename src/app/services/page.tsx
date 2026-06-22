'use client';
import React, { useEffect, useState } from 'react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ marginBottom: '4rem' }}>
        <h1 className="animate-slide-up" style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
          Our Services
        </h1>
        <p className="animate-slide-up delay-1 text-gray" style={{ fontSize: '1.2rem', maxWidth: '600px', color: 'var(--color-text-secondary)' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              {services.map((service, index) => (
                <div key={service.id || index} className={`minimal-card animate-slide-up delay-${(index % 3) + 1}`} style={{ background: 'var(--color-bg-primary)' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{service.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)' }}>{service.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
