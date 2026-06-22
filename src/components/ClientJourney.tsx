import React from 'react';

const steps = [
  { step: '01', title: 'Discovery' },
  { step: '02', title: 'Strategy' },
  { step: '03', title: 'Design' },
  { step: '04', title: 'Development' },
  { step: '05', title: 'AI Integration' },
  { step: '06', title: 'Launch' },
  { step: '07', title: 'Growth' }
];

export default function ClientJourney() {
  return (
    <section className="section" style={{ background: 'var(--color-primary-midnight)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>The <span className="text-gradient">Client Journey</span></h2>
          <p className="text-gray" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Our proven process to transform your business from concept to scale.
          </p>
        </div>

        <div style={{ display: 'flex', overflowX: 'auto', gap: '2rem', padding: '1rem 0' }}>
          {steps.map((step, i) => (
            <div key={i} className="glass-card" style={{ minWidth: '250px', padding: '2rem', textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.5rem auto',
                fontSize: '1.2rem',
                fontWeight: 700
              }}>
                {step.step}
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>{step.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
