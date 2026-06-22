import React from 'react';

export default function AgentsManagementPage() {
  const agents = [
    { id: 1, name: 'SalesBot', type: 'Lead Generation', status: 'Active', load: '45%' },
    { id: 2, name: 'SupportGPT', type: 'Customer Support', status: 'Active', load: '82%' },
    { id: 3, name: 'DataScraper', type: 'Data Extraction', status: 'Paused', load: '0%' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>AI Agents</h1>
        <button className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Deploy New Agent</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {agents.map((agent) => (
          <div key={agent.id} className="minimal-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>{agent.name}</h3>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: agent.status === 'Active' ? '#34c759' : '#ff3b30' }}></div>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{agent.type}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>System Load: {agent.load}</span>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 500, fontSize: '0.8rem' }}>Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
