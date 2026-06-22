import React from 'react';

const capabilities = [
  'Find Leads', 'Analyze Businesses', 'Send Emails', 'Manage CRM', 
  'Book Meetings', 'Translate Conversations', 'Generate Proposals', 'Handle Customer Support'
];

export default function AgentShowcase() {
  return (
    <section id="agents" className="section" style={{ background: 'var(--color-primary-midnight)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>What Can Our <span className="text-gradient">AI Agents</span> Do?</h2>
          <p className="text-gray" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Imagine having a digital employee that never sleeps, never takes a break, and executes flawlessly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'center' }}>
          
          {/* Capabilities List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {capabilities.map((cap, i) => (
              <div key={i} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-purple)' }}></div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{cap}</span>
              </div>
            ))}
          </div>

          {/* Futuristic Dashboard Mockup */}
          <div className="glass-card" style={{ 
            height: '500px', 
            position: 'relative', 
            overflow: 'hidden', 
            border: '1px solid rgba(176, 38, 255, 0.3)',
            boxShadow: '0 0 50px rgba(176, 38, 255, 0.1)' 
          }}>
            {/* Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
              </div>
              <span className="text-gray" style={{ fontSize: '0.8rem' }}>AI Command Protocol v2.0</span>
            </div>

            {/* Workflow Diagram Mock */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
              
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '1rem 2rem', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--color-accent-cyan)', borderRadius: '50px', color: 'var(--color-accent-cyan)' }}>
                  Incoming Request Detected
                </div>
              </div>

              <div style={{ width: '2px', height: '30px', background: 'var(--color-accent-cyan)', margin: '0 auto', opacity: 0.5 }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div className="glass-card" style={{ padding: '1rem', width: '150px', textAlign: 'center', borderColor: 'var(--color-accent-purple)' }}>
                  <p style={{ fontSize: '0.8rem' }}>Analyze Intent</p>
                </div>
                <div className="glass-card" style={{ padding: '1rem', width: '150px', textAlign: 'center', borderColor: 'var(--color-accent-purple)' }}>
                  <p style={{ fontSize: '0.8rem' }}>Fetch CRM Data</p>
                </div>
                <div className="glass-card" style={{ padding: '1rem', width: '150px', textAlign: 'center', borderColor: 'var(--color-accent-purple)' }}>
                  <p style={{ fontSize: '0.8rem' }}>Generate Draft</p>
                </div>
              </div>

              <div style={{ width: '2px', height: '30px', background: 'var(--color-accent-purple)', margin: '0 auto', opacity: 0.5 }}></div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ padding: '1rem 2rem', background: 'rgba(176, 38, 255, 0.1)', border: '1px solid var(--color-accent-purple)', borderRadius: '50px', color: 'var(--color-accent-purple)' }}>
                  Action Executed Successfully
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
