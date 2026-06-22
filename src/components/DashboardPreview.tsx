import React from 'react';

export default function DashboardPreview() {
  return (
    <section className="section" style={{ background: 'var(--color-primary-midnight)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Enterprise <span className="text-gradient">Control Panel</span></h2>
          <p className="text-gray" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Manage everything from a unified, futuristic dashboard.
          </p>
        </div>

        <div className="glass-card" style={{ 
          height: '600px', 
          padding: '0', 
          overflow: 'hidden', 
          display: 'flex',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          boxShadow: '0 0 50px rgba(0, 229, 255, 0.1)' 
        }}>
          {/* Sidebar */}
          <div style={{ width: '250px', background: 'rgba(5,5,5,0.5)', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1rem' }}>
            <div style={{ marginBottom: '2rem', paddingLeft: '1rem' }}>
              <span style={{ fontFamily: 'Outfit', fontWeight: 700 }}>ADMIN PRO</span>
            </div>
            {['Overview', 'AI Agents', 'CRM', 'Leads', 'Settings'].map((item, i) => (
              <div key={i} style={{ 
                padding: '0.8rem 1rem', 
                borderRadius: '8px', 
                marginBottom: '0.5rem',
                background: i === 0 ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                color: i === 0 ? 'var(--color-accent-cyan)' : 'var(--color-text-gray)',
                cursor: 'pointer'
              }}>
                {item}
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div style={{ flex: 1, padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3>System Overview</h3>
              <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', fontSize: '0.8rem' }}>Live Systems: Active</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-gray" style={{ fontSize: '0.9rem' }}>Total Revenue</p>
                <h2 style={{ color: 'var(--color-text-white)' }}>$124,500</h2>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-gray" style={{ fontSize: '0.9rem' }}>Active Leads</p>
                <h2 style={{ color: 'var(--color-accent-cyan)' }}>842</h2>
              </div>
              <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-gray" style={{ fontSize: '0.9rem' }}>Agent Interactions</p>
                <h2 style={{ color: 'var(--color-accent-purple)' }}>12.4k</h2>
              </div>
            </div>

            <div className="glass-card" style={{ height: '250px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p className="text-gray">[ Interactive Analytics Chart Placeholder ]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
