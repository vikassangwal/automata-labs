'use client';
import React, { useState } from 'react';

export default function AnalyzerPage() {
  const [tab, setTab] = useState<'analyzer' | 'scraper'>('analyzer');

  // Analyzer State
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [analyzerError, setAnalyzerError] = useState('');

  // Scraper State
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [scraping, setScraping] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [scraperMsg, setScraperMsg] = useState('');
  const [savingLead, setSavingLead] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setAnalyzing(true); setReport(null); setAnalyzerError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (res.ok) {
        setReport(data);
      } else {
        setAnalyzerError(data.error || 'Analysis failed');
      }
    } catch {
      setAnalyzerError('Network error. Target website might be unreachable.');
    }
    setAnalyzing(false);
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !location) return;
    setScraping(true); setLeads([]); setScraperMsg('');
    try {
      const res = await fetch('/api/leads/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, location })
      });
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads);
        setScraperMsg(data.message);
      } else {
        setScraperMsg(data.error || 'Scraping failed');
      }
    } catch {
      setScraperMsg('Network error.');
    }
    setScraping(false);
  };

  const handleSaveToCRM = async (lead: any) => {
    setSavingLead(lead.name);
    try {
      await fetch('/api/crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lead.name, email: lead.email, company: lead.company, source: 'scraper' })
      });
      // Update UI to show saved
      setLeads(leads.map(l => l.name === lead.name ? { ...l, saved: true } : l));
    } catch {
      alert('Failed to save lead to CRM');
    }
    setSavingLead(null);
  };

  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg-secondary)' };
  const tabStyle = (active: boolean): React.CSSProperties => ({ flex: 1, padding: '0.7rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', background: active ? 'var(--color-bg-primary)' : 'transparent', boxShadow: active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Lead Intelligence</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Analyze competitor websites and scrape high-quality local leads.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--color-bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: '2rem', maxWidth: '350px' }}>
        <button onClick={() => setTab('analyzer')} style={tabStyle(tab === 'analyzer')}>Website Analyzer</button>
        <button onClick={() => setTab('scraper')} style={tabStyle(tab === 'scraper')}>Local Lead Scraper</button>
      </div>

      {/* --- TAB: WEBSITE ANALYZER --- */}
      {tab === 'analyzer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left: Input Form */}
          <div className="minimal-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Scan Target Website</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Enter a prospect's URL. The AI will extract SEO, performance, and UI flaws to use as leverage in your outreach message.
            </p>
            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Website URL</label>
                <input type="text" required value={url} onChange={e => setUrl(e.target.value)} placeholder="e.g. example.com" style={inputStyle} />
              </div>
              <button type="submit" disabled={analyzing} className="btn-primary" style={{ padding: '0.8rem', opacity: analyzing ? 0.6 : 1 }}>
                {analyzing ? '🔍 Scanning Website...' : 'Analyze Website'}
              </button>
            </form>
            {analyzerError && <p style={{ color: '#ff3b30', fontSize: '0.85rem', marginTop: '1rem', padding: '1rem', background: '#ffebee', borderRadius: '8px' }}>{analyzerError}</p>}
          </div>

          {/* Right: Analysis Report */}
          <div className="minimal-card" style={{ background: report ? 'var(--color-bg-primary)' : '#fafafa', minHeight: '400px' }}>
            {!report && !analyzing && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-secondary)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</p>
                <p>Awaiting target URL. Scan results will appear here.</p>
              </div>
            )}
            
            {analyzing && (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-secondary)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</p>
                <p>Scraping DOM and analyzing metadata...</p>
              </div>
            )}

            {report && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '1.2rem' }}>Analysis Report</h3>
                  <div style={{ padding: '0.4rem 1rem', background: report.score > 70 ? '#e8f5e9' : report.score > 40 ? '#fff3e0' : '#ffebee', color: report.score > 70 ? '#2e7d32' : report.score > 40 ? '#e65100' : '#c62828', borderRadius: '50px', fontWeight: 700 }}>
                    Score: {report.score}/100
                  </div>
                </div>

                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>Target: <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)' }}>{report.url}</span></p>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Critical Flaws Found:</h4>
                  {report.flaws.length === 0 ? (
                    <p style={{ color: '#2e7d32', fontSize: '0.9rem' }}>No critical issues found. Good job to them!</p>
                  ) : (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', color: '#ff3b30', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {report.flaws.map((flaw: string, idx: number) => <li key={idx}>{flaw}</li>)}
                    </ul>
                  )}
                </div>

                <button onClick={() => {
                  navigator.clipboard.writeText(report.flaws.join('\n'));
                  alert('Flaws copied to clipboard! Paste them in the AI Outreach Hub.');
                }} className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                  📋 Copy Flaws for Outreach
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB: LEAD SCRAPER --- */}
      {tab === 'scraper' && (
        <div>
          <div className="minimal-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Extract Local Business Leads</h3>
            <form onSubmit={handleScrape} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Business Type / Niche</label>
                <input type="text" required value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Plumbers, Real Estate Agents" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>Location</label>
                <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. New York, London" style={inputStyle} />
              </div>
              <button type="submit" disabled={scraping} className="btn-primary" style={{ padding: '0.8rem 2rem', opacity: scraping ? 0.6 : 1, height: '45px' }}>
                {scraping ? 'Extracting...' : 'Extract Leads'}
              </button>
            </form>
          </div>

          {scraperMsg && (
            <div style={{ padding: '1rem', background: scraperMsg.includes('Demo') ? '#fff3cd' : '#e8f5e9', color: scraperMsg.includes('Demo') ? '#856404' : '#2e7d32', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500, border: `1px solid ${scraperMsg.includes('Demo') ? '#ffeeba' : '#c3e6cb'}` }}>
              {scraperMsg}
            </div>
          )}

          {leads.length > 0 && (
            <div className="minimal-card" style={{ padding: '0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                  <tr>
                    <th style={{ padding: '1rem', fontWeight: 600 }}>Business Name</th>
                    <th style={{ padding: '1rem', fontWeight: 600 }}>Email</th>
                    <th style={{ padding: '1rem', fontWeight: 600 }}>Phone</th>
                    <th style={{ padding: '1rem', fontWeight: 600 }}>Website</th>
                    <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>{lead.name}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{lead.email}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{lead.phone}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-accent)' }}>{lead.website}</td>
                      <td style={{ padding: '1rem' }}>
                        {lead.saved ? (
                          <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.85rem' }}>✓ Saved in CRM</span>
                        ) : (
                          <button onClick={() => handleSaveToCRM(lead)} disabled={savingLead === lead.name} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', opacity: savingLead === lead.name ? 0.6 : 1 }}>
                            {savingLead === lead.name ? 'Saving...' : '+ Add to CRM'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
