'use client';
import React, { useState, useEffect } from 'react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [imageUrl, setImageUrl] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch { console.error('Error fetching services'); }
    setLoading(false);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status, imageUrl })
      });
      if (res.ok) {
        setTitle(''); setDescription(''); setImageUrl('');
        fetchServices();
      } else {
        alert('Failed to add service');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchServices();
    } catch { alert('Error deleting service'); }
  };

  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg-secondary)', marginBottom: '1rem' };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Services Management</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Add or remove services offered on your website.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* ADD POST */}
        <div className="minimal-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Add New Service</h3>
          
          <form onSubmit={handleAddService}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Service Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. AI Chatbots" style={inputStyle} />
            
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
            
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Short Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the service..." rows={4} style={{...inputStyle, resize: 'vertical'}} />

            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Service Image</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ flex: 1, padding: '0.5rem', background: '#fff', border: '1px solid #ddd', borderRadius: '6px' }} />
              {imageUrl && <img src={imageUrl} alt="Preview" style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '6px' }} />}
            </div>
            
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', marginTop: '-0.5rem' }}>Or paste an image URL directly:</p>
            <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" style={inputStyle} />
            <button type="submit" disabled={adding} className="btn-primary" style={{ padding: '0.8rem 1.5rem', opacity: adding ? 0.6 : 1, width: '100%' }}>
              {adding ? 'Adding...' : 'Add Service'}
            </button>
          </form>
        </div>

        {/* LIST POSTS */}
        <div className="minimal-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Current Services</h3>
          </div>
          <div style={{ padding: '1rem', overflowY: 'auto', maxHeight: '500px' }}>
            {loading ? <p>Loading...</p> : services.length === 0 ? <p style={{color: 'var(--color-text-secondary)'}}>No services yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {services.map(service => (
                  <div key={service.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-bg-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontWeight: 600 }}>{service.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.3rem' }}>{service.description}</p>
                      </div>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: service.status === 'Active' ? '#e8f5e9' : '#fff3e0', color: service.status === 'Active' ? '#2e7d32' : '#e65100', borderRadius: '50px', fontWeight: 600 }}>{service.status}</span>
                    </div>
                    <button onClick={() => handleDelete(service.id)} style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '0.85rem', padding: 0 }}>Delete</button>
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
