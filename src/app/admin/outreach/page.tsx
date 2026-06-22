'use client';
import React, { useEffect, useState } from 'react';

export default function OutreachHub() {
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [tab, setTab] = useState<'compose' | 'sent'>('compose');

  // Compose state
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [websiteFlaws, setWebsiteFlaws] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  // Draft state
  const [draft, setDraft] = useState<any>(null);
  const [drafting, setDrafting] = useState(false);
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetch('/api/crm').then(r => r.ok ? r.json() : []).then(d => { if (Array.isArray(d)) setLeads(d); });
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch('/api/outreach/messages').then(r => r.ok ? r.json() : []).then(d => { if (Array.isArray(d)) setMessages(d); });
  };

  const handleSelectLead = (lead: any) => {
    setSelectedLead(lead);
    setCustomName(lead.name);
    setCustomEmail(lead.email);
    setCustomCompany(lead.company || '');
    setDraft(null);
    setStatusMsg('');
  };

  const handleDraft = async () => {
    setDrafting(true); setDraft(null); setStatusMsg('');
    try {
      const res = await fetch('/api/outreach/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead?.id || 'manual',
          leadName: customName,
          leadEmail: customEmail,
          leadCompany: customCompany,
          websiteFlaws: websiteFlaws || null,
          customPrompt: customPrompt || null
        })
      });
      const data = await res.json();
      if (res.ok) {
        setDraft(data);
        setStatusMsg(data.message);
      } else {
        setStatusMsg(data.error || 'Failed to draft');
      }
    } catch { setStatusMsg('Network error'); }
    setDrafting(false);
  };

  const handleSend = async (channel: string) => {
    if (!draft?.id) return;
    setSending(true); setStatusMsg('');
    try {
      const res = await fetch('/api/outreach/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: draft.id, toEmail: customEmail, channel })
      });
      const data = await res.json();
      setStatusMsg(data.message);
      if (data.success) { fetchMessages(); }
    } catch { setStatusMsg('Network error'); }
    setSending(false);
  };

  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg-secondary)' };
  const tabStyle = (active: boolean): React.CSSProperties => ({ flex: 1, padding: '0.7rem', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', background: active ? 'var(--color-bg-primary)' : 'transparent', boxShadow: active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', color: active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' });

  return (
    <div>
      <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>AI Outreach Hub</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Draft AI-powered messages and send via Email, WhatsApp, or SMS.</p>

      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--color-bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: '2rem', maxWidth: '300px' }}>
        <button onClick={() => setTab('compose')} style={tabStyle(tab === 'compose')}>Compose</button>
        <button onClick={() => setTab('sent')} style={tabStyle(tab === 'sent')}>Sent ({messages.filter(m => m.status === 'sent').length})</button>
      </div>

      {tab === 'compose' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left: Lead Selection + Form */}
          <div>
            {/* Quick Select from CRM */}
            {leads.length > 0 && (
              <div className="minimal-card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Quick Select from CRM</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {leads.map(l => (
                    <button key={l.id} onClick={() => handleSelectLead(l)} style={{
                      padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: selectedLead?.id === l.id ? 'var(--color-text-primary)' : 'var(--color-bg-secondary)', color: selectedLead?.id === l.id ? '#fff' : 'inherit', cursor: 'pointer', textAlign: 'left', fontWeight: 500
                    }}>
                      {l.name} — {l.email}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Input */}
            <div className="minimal-card">
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Lead Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Name *</label>
                  <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="John Doe" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Email *</label>
                  <input type="email" value={customEmail} onChange={e => setCustomEmail(e.target.value)} placeholder="john@company.com" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Company</label>
                  <input type="text" value={customCompany} onChange={e => setCustomCompany(e.target.value)} placeholder="Acme Corp" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Website Flaws (Optional)</label>
                  <textarea value={websiteFlaws} onChange={e => setWebsiteFlaws(e.target.value)} placeholder="e.g. No mobile responsiveness, slow load times, missing SEO meta tags..." rows={3} style={{ ...inputStyle, resize: 'none' as const }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.3rem', fontWeight: 600 }}>Custom AI Prompt (Optional)</label>
                  <textarea value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="e.g. Focus on their need for a chatbot..." rows={2} style={{ ...inputStyle, resize: 'none' as const }} />
                </div>
                <button onClick={handleDraft} disabled={drafting || !customName || !customEmail} className="btn-primary" style={{ padding: '0.8rem', opacity: (drafting || !customName || !customEmail) ? 0.6 : 1 }}>
                  {drafting ? '✨ AI is drafting...' : '✨ Generate AI Draft'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Draft Preview + Send */}
          <div>
            <div className="minimal-card" style={{ minHeight: '400px', background: draft ? 'var(--color-bg-primary)' : '#fafafa' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Message Preview</h3>

              {!draft && !drafting && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-secondary)' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</p>
                  <p>Fill in lead details and click "Generate AI Draft" to see your personalized outreach message here.</p>
                </div>
              )}

              {drafting && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-text-secondary)' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</p>
                  <p>AI is crafting a personalized message...</p>
                </div>
              )}

              {draft && (
                <div>
                  {draft.aiGenerated && (
                    <div style={{ display: 'inline-block', padding: '0.2rem 0.6rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>
                      AI Generated
                    </div>
                  )}
                  <div style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: '8px', marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Subject:</p>
                    <p style={{ fontWeight: 600 }}>{draft.subject}</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.3rem' }}>Body:</p>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{draft.body}</p>
                  </div>

                  {/* Send Buttons */}
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button onClick={() => handleSend('email')} disabled={sending} className="btn-primary" style={{ flex: 1, padding: '0.8rem', opacity: sending ? 0.6 : 1 }}>
                      {sending ? 'Sending...' : '📧 Send Email'}
                    </button>
                    <button onClick={() => handleSend('whatsapp')} disabled={sending} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #25D366', background: '#25D366', color: '#fff', cursor: 'pointer', fontWeight: 600, opacity: sending ? 0.6 : 1 }}>
                      WhatsApp
                    </button>
                    <button onClick={() => handleSend('sms')} disabled={sending} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', cursor: 'pointer', fontWeight: 600, opacity: sending ? 0.6 : 1 }}>
                      SMS
                    </button>
                  </div>
                </div>
              )}

              {statusMsg && (
                <div style={{ marginTop: '1rem', padding: '0.8rem', background: statusMsg.includes('error') || statusMsg.includes('Failed') ? '#ffebee' : '#e8f5e9', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 500, color: statusMsg.includes('error') || statusMsg.includes('Failed') ? '#c62828' : '#2e7d32' }}>
                  {statusMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sent Messages Tab */}
      {tab === 'sent' && (
        <div className="minimal-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Channel</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Subject</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>AI?</th>
                <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No outreach messages yet.</td></tr>
              ) : (
                messages.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', background: m.channel === 'email' ? '#e3f2fd' : m.channel === 'whatsapp' ? '#e8f5e9' : 'var(--color-bg-secondary)', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {m.channel.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{m.subject || '—'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.2rem 0.6rem', background: m.status === 'sent' ? '#e8f5e9' : '#fff3e0', color: m.status === 'sent' ? '#2e7d32' : '#e65100', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{m.aiGenerated ? '✨ Yes' : 'Template'}</td>
                    <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{new Date(m.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
