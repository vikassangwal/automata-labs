'use client';
import React, { useEffect, useState } from 'react';

export default function LeadsAdmin() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/leads', window.location.origin);
      url.searchParams.append('page', page.toString());
      if (search) url.searchParams.append('search', search);

      const res = await fetch(url.toString());
      const data = await res.json();
      setLeads(data.leads || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchLeads(); }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleExport = () => {
    window.location.href = '/api/leads/export';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#111827' }}>Lead Management</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>View and export leads captured from the blog and chatbot.</p>
        </div>
        <button onClick={handleExport} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📥 Export CSV
        </button>
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #e5e7eb', outline: 'none' }}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Contact Info</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Source</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.8rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500, color: '#111827' }}>
                  {lead.name}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ color: '#0066cc', marginBottom: '0.25rem' }}>{lead.email}</div>
                  {lead.phone && <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{lead.phone}</div>}
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ padding: '0.2rem 0.6rem', background: '#ecfdf5', color: '#059669', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {lead.source}
                  </span>
                  {lead.post && <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>from: {lead.post.title}</div>}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: '#4b5563', fontSize: '0.9rem' }}>
                  {new Date(lead.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && !isLoading && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <p>No leads found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary">Prev</button>
          <span>{page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary">Next</button>
        </div>
      )}
    </div>
  );
}
