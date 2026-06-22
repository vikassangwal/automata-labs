import React from 'react';

const projects = [
  { id: 1, title: 'Nexus AI CRM', category: 'SaaS Platform', type: 'Dashboard' },
  { id: 2, title: 'HealthBot Pro', category: 'AI Agent', type: 'Mobile' },
  { id: 3, title: 'Apex Real Estate', category: 'Web App', type: 'Laptop' },
  { id: 4, title: 'FinFlow Auto', category: 'Automation System', type: 'Dashboard' },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Featured <span className="text-gradient">Work</span></h2>
          <p className="text-gray" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Explore our premium gallery of AI agents, enterprise software, and automation systems.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {projects.map((project, i) => (
            <div key={i} className="glass-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Image Placeholder representing high-end mockup */}
              <div style={{ 
                height: '300px', 
                background: 'rgba(0,0,0,0.5)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}>
                <div style={{ 
                  padding: '1rem 2rem', 
                  background: 'rgba(255,255,255,0.1)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  color: 'var(--color-text-white)',
                  fontSize: '0.9rem',
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  {project.type} Mockup
                </div>
              </div>
              <div style={{ padding: '2rem' }}>
                <span className="text-gradient" style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>{project.category}</span>
                <h3 style={{ fontSize: '1.8rem', marginTop: '0.5rem' }}>{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn-secondary">View Full Portfolio</button>
        </div>
      </div>
    </section>
  );
}
