'use client';
import React, { useEffect, useState } from 'react';

export default function PortfolioManagementPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Website');
  const [status, setStatus] = useState('Published');
  const [imageUrl, setImageUrl] = useState('');
  const [websiteLink, setWebsiteLink] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchProjects = () => {
    fetch('/api/portfolio')
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, type, status, imageUrl, websiteLink })
      });
      if (res.ok) {
        setTitle(''); setCategory(''); setImageUrl(''); setWebsiteLink('');
        fetchProjects();
      } else {
        alert('Failed to add project');
      }
    } catch { alert('Network error'); }
    setAdding(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg-secondary)', marginBottom: '1rem' };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Portfolio Management</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Manage past projects, websites, and case studies shown to users.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* ADD PROJECT */}
        <div className="minimal-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Add New Project</h3>
          
          <form onSubmit={handleAddProject}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Project Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Acme Corp Automation" style={inputStyle} />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Category</label>
                <input type="text" required value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. AI Agent" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Live Website Link (Optional)</label>
            <input type="url" value={websiteLink} onChange={e => setWebsiteLink(e.target.value)} placeholder="https://example.com" style={inputStyle} />

            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Project Image</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ flex: 1, padding: '0.5rem', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }} />
              {imageUrl && <img src={imageUrl} alt="Preview" style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
            </div>
            
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', marginTop: '-0.5rem' }}>Or paste an image URL directly:</p>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" style={inputStyle} />
            
            <button type="submit" disabled={adding} className="btn-primary" style={{ padding: '0.8rem 1.5rem', opacity: adding ? 0.6 : 1, width: '100%' }}>
              {adding ? 'Adding...' : 'Add Project'}
            </button>
          </form>
        </div>

        {/* LIST PROJECTS */}
        <div className="minimal-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Current Portfolio</h3>
          </div>
          <div style={{ padding: '1rem', overflowY: 'auto', maxHeight: '600px' }}>
            {loading ? <p>Loading...</p> : projects.length === 0 ? <p style={{color: 'var(--color-text-secondary)'}}>No projects yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.map(proj => (
                  <div key={proj.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-bg-secondary)' }}>
                    {proj.imageUrl && <img src={proj.imageUrl} alt={proj.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 600 }}>{proj.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>{proj.category}</p>
                      {proj.websiteLink && <a href={proj.websiteLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0066cc', textDecoration: 'none', marginTop: '0.4rem', display: 'inline-block' }}>View Site ↗</a>}
                    </div>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: proj.status === 'Published' ? '#e8f5e9' : '#fff3e0', color: proj.status === 'Published' ? '#2e7d32' : '#e65100', borderRadius: '50px', fontWeight: 600, height: 'fit-content' }}>{proj.status}</span>
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
