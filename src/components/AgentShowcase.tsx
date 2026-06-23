'use client';
import React, { useState } from 'react';

const capabilities = [
  'Find Leads', 'Analyze Businesses', 'Send Emails', 'Manage CRM', 
  'Book Meetings', 'Translate Conversations', 'Generate Proposals', 'Handle Customer Support'
];

export default function AgentShowcase() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !email) return;
    setAnalyzing(true); setReport(null); setError('');
    try {
      // Create a lead automatically
      fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Website Analyzer Lead', email, website: url, source: 'ai_analyzer' })
      });

      // Run analysis
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (res.ok) {
        setReport(data);
      } else {
        setError('Could not analyze website. It might be blocking bots.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setAnalyzing(false);
  };

  return (
    <section id="agents" className="section" style={{ background: 'var(--color-primary-midnight)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>See Our <span className="text-gradient">AI Agent</span> in Action</h2>
          <p className="text-gray" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            Enter your website URL below and let our AI Agent analyze your site to give you actionable improvement suggestions in seconds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'flex-start' }}>
          
          {/* Capabilities List */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {capabilities.map((cap, i) => (
              <div key={i} className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-purple)' }}></div>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{cap}</span>
              </div>
            ))}
          </div>

          {/* Interactive AI Agent Form */}
          <div className="glass-card" style={{ 
            minHeight: '400px', 
            position: 'relative', 
            overflow: 'hidden', 
            border: '1px solid rgba(176, 38, 255, 0.3)',
            boxShadow: '0 0 50px rgba(176, 38, 255, 0.1)',
            padding: '2rem'
          }}>
            {!report ? (
              <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                  <h3 style={{ fontSize: '1.5rem' }}>Free AI Website Audit</h3>
                  <p className="text-gray" style={{ fontSize: '0.9rem' }}>Find out what's stopping your website from converting.</p>
                </div>

                <input type="text" placeholder="https://yourwebsite.com" required value={url} onChange={e => setUrl(e.target.value)} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%', outline: 'none' }} />
                <input type="email" placeholder="Your Email Address" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', width: '100%', outline: 'none' }} />
                
                {error && <p style={{ color: '#ff5f56', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}

                <button type="submit" className="btn-primary" disabled={analyzing} style={{ padding: '1rem', opacity: analyzing ? 0.7 : 1, width: '100%' }}>
                  {analyzing ? 'Scanning Website...' : 'Analyze My Website'}
                </button>
              </form>
            ) : (
              <div style={{ animation: 'slideUpFade 0.5s ease' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#25D366' }}>Analysis Complete!</h3>
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>AI Performance Score: {report.score}/100</p>
                  <p className="text-gray" style={{ fontSize: '0.9rem' }}>We found a few areas where you can improve:</p>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
                  {report.flaws.slice(0, 3).map((flaw: string, idx: number) => (
                    <li key={idx} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.9rem', color: '#ff5f56' }}>
                      <span>⚠️</span> {flaw}
                    </li>
                  ))}
                </ul>

                <div style={{ padding: '1rem', background: 'rgba(176, 38, 255, 0.1)', border: '1px solid var(--color-accent-purple)', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Our team has received this report. We will email you a custom proposal to fix these issues.</p>
                  <button onClick={() => setReport(null)} className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Scan Another Site</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
