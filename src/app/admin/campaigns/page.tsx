'use client';
import React, { useState, useEffect } from 'react';

export default function CampaignsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    fetchLeadsWithoutWebsites();
  }, []);

  const fetchLeadsWithoutWebsites = async () => {
    try {
      const res = await fetch('/api/leads?filter=no_website');
      const data = await res.json();
      if (res.ok && data.leads) {
        // Filter leads locally just to be sure
        const noWeb = data.leads.filter((l: any) => !l.website || l.website.trim() === '');
        setLeads(noWeb);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName || leads.length === 0) return;
    
    setSending(true);
    setResults(null);
    try {
      const leadIds = leads.map(l => l.id);
      const res = await fetch('/api/campaigns/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: campaignName, leadIds })
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
        alert(`Campaign Completed! Sent ${data.sent} emails.`);
        fetchLeadsWithoutWebsites();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      alert('Network error.');
    }
    setSending(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Website Pitch Campaigns 🚀</h1>
        <p style={{ color: '#6b7280' }}>Send personalized, AI-generated emails to leads who do not have a website.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Campaign Setup */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Launch New Campaign</h2>
          <form onSubmit={handleLaunchCampaign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Campaign Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Q3 Website Outreach"
                value={campaignName} 
                onChange={(e) => setCampaignName(e.target.value)} 
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }} 
              />
            </div>
            
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0066cc' }}>{leads.length}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Eligible Leads (No Website)</div>
            </div>

            <button 
              type="submit" 
              disabled={sending || leads.length === 0} 
              style={{ background: '#1d1d1f', color: '#fff', padding: '1rem', borderRadius: '8px', border: 'none', cursor: sending || leads.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 600, marginTop: '1rem' }}
            >
              {sending ? 'Generating & Sending Emails...' : 'Blast Campaign Now'}
            </button>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>Emails will be sent using your SMTP credentials from the Email Hub settings.</p>
          </form>

          {results && (
            <div style={{ marginTop: '2rem', padding: '1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', color: '#065f46', marginBottom: '0.5rem' }}>Campaign Results</h3>
              <p style={{ fontSize: '0.85rem', color: '#047857' }}>✅ Successfully sent: {results.sent}</p>
              <p style={{ fontSize: '0.85rem', color: '#b91c1c' }}>❌ Failed: {results.failed}</p>
            </div>
          )}
        </div>

        {/* Target Audience Preview */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f8f9fa' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Target Audience Preview</h2>
          </div>
          
          <div style={{ padding: '1rem', overflowY: 'auto', maxHeight: '500px' }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>Loading leads...</p>
            ) : leads.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>All your leads already have a website! 🚀</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {leads.map(lead => (
                  <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #f3f4f6', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{lead.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{lead.email}</div>
                    </div>
                    <div style={{ fontSize: '0.75rem', background: '#fef2f2', color: '#991b1b', padding: '0.3rem 0.6rem', borderRadius: '12px', fontWeight: 600 }}>
                      No Website
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
