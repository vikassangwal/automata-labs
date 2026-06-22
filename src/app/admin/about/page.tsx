'use client';
import React, { useState, useEffect } from 'react';

export default function AdminAboutPage() {
  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const [mission, setMission] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about');
      const data = await res.json();
      if (data) {
        setHeading(data.heading || '');
        setContent(data.content || '');
        setMission(data.mission || '');
        setImageUrl(data.imageUrl || '');
      }
    } catch { console.error('Error fetching about info'); }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heading, content, mission, imageUrl })
      });
      if (res.ok) {
        setMsg('About content saved successfully! Changes are live on the homepage.');
      } else {
        setMsg('Failed to save.');
      }
    } catch { setMsg('Network error.'); }
    setSaving(false);
  };

  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg-secondary)', marginBottom: '1rem' };
  const labelStyle = { display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 };

  if (loading) return <div style={{ padding: '2rem' }}>Loading editor...</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>About Us Editor</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Edit the content that appears on the homepage "About" section.</p>

      <div className="minimal-card" style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSave}>
          <label style={labelStyle}>Heading</label>
          <input type="text" value={heading} onChange={e => setHeading(e.target.value)} placeholder="e.g. Who We Are" style={inputStyle} required />

          <label style={labelStyle}>Company Story / Description</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your story..." rows={6} style={{...inputStyle, resize: 'vertical'}} required />

          <label style={labelStyle}>Our Mission (Optional)</label>
          <input type="text" value={mission} onChange={e => setMission(e.target.value)} placeholder="e.g. To automate the world" style={inputStyle} />

          <label style={labelStyle}>Image URL (Optional)</label>
          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" style={inputStyle} />

          {msg && <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: msg.includes('error') || msg.includes('Failed') ? '#c62828' : '#2e7d32' }}>{msg}</p>}

          <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.8rem 2rem', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
