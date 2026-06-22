import React from 'react';

export default function AgentsPage() {
  const agents = [
    { name: "Support AI", role: "Customer Success", task: "Handles 10k+ queries/mo" },
    { name: "Sales AI", role: "Lead Qualification", task: "Books 150+ meetings/mo" },
    { name: "Ops AI", role: "Internal Operations", task: "Manages HR & Scheduling" },
  ];

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 className="animate-slide-up" style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
          Intelligent AI Agents
        </h1>
        <p className="animate-slide-up delay-1 text-gray" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-secondary)' }}>
          Deploy autonomous digital workers that integrate directly into your Slack, Email, and CRMs.
        </p>
      </div>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {agents.map((agent, index) => (
              <div key={index} className={`minimal-card animate-slide-up delay-${index + 1}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--color-accent)' }}>{agent.name}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>{agent.role}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ padding: '0.4rem 1rem', background: 'var(--color-bg-secondary)', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                    {agent.task}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
