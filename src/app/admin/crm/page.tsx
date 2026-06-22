'use client';
import React, { useEffect, useState } from 'react';

export default function CRMPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  const fetchLeads = () => {
    fetch('/api/crm')
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setLeads(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedLeads(leads.map(l => l.id));
    else setSelectedLeads([]);
  };

  const handleBulkAction = async () => {
    if (selectedLeads.length === 0) return alert('No leads selected');
    if (bulkAction === 'email') {
      const subject = prompt('Enter Email Subject:');
      const body = prompt('Enter Email Body:');
      if (!subject || !body) return;

      for (const id of selectedLeads) {
        const lead = leads.find(l => l.id === id);
        if (lead) {
          // Fire and forget send
          fetch('/api/outreach/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId: lead.id, toEmail: lead.email, channel: 'email', subject, body })
          }).catch(e => console.log(e));
        }
      }
      alert('Bulk emails are being sent!');
      setSelectedLeads([]);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>CRM & Leads</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {selectedLeads.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select value={bulkAction} onChange={e => setBulkAction(e.target.value)} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <option value="">Bulk Actions</option>
                <option value="email">Send Email Blast</option>
              </select>
              <button onClick={handleBulkAction} className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Apply</button>
            </div>
          )}
          <button className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>Export CSV</button>
        </div>
      </div>

      <div className="minimal-card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
            <tr>
              <th style={{ padding: '1rem', width: '40px' }}>
                <input type="checkbox" onChange={handleSelectAll} checked={selectedLeads.length > 0 && selectedLeads.length === leads.length} />
              </th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Company</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Date</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : leads.length === 0 ? (
               <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No leads found. Share your contact page to get started.</td></tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid var(--color-border)', background: selectedLeads.includes(lead.id) ? 'var(--color-bg-secondary)' : 'transparent' }}>
                  <td style={{ padding: '1rem' }}>
                    <input type="checkbox" checked={selectedLeads.includes(lead.id)} onChange={() => handleSelect(lead.id)} />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{lead.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{lead.email}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{lead.company || '-'}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.8rem', 
                      borderRadius: '50px', 
                      fontSize: '0.8rem', 
                      background: lead.status === 'Converted' ? '#e8f5e9' : 'var(--color-bg-secondary)',
                      color: lead.status === 'Converted' ? '#2e7d32' : 'inherit'
                    }}>
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 500 }}>Contact</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
