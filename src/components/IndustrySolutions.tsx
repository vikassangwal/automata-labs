import React from 'react';

const industries = [
  'Healthcare', 'Real Estate', 'Education', 'Finance', 'Construction', 
  'E-Commerce', 'Hotels', 'Gyms', 'Restaurants', 'Agencies'
];

export default function IndustrySolutions() {
  return (
    <section className="section" style={{ background: 'var(--color-primary-midnight)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>AI Solutions For <span className="text-gradient">Every Industry</span></h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {industries.map((ind, i) => (
            <div key={i} className="glass-card" style={{ 
              padding: '1rem 2rem', 
              borderRadius: '50px', 
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{ind}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
