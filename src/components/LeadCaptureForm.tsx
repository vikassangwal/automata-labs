'use client';
import React, { useState } from 'react';

interface Props {
  postId?: string;
}

export default function LeadCaptureForm({ postId }: Props) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: postId ? 'blog_incontent' : 'newsletter_footer',
          postId
        })
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div style={{
        padding: '2rem',
        background: 'rgba(37, 211, 102, 0.1)',
        border: '1px solid rgba(37, 211, 102, 0.3)',
        borderRadius: '16px',
        textAlign: 'center',
        margin: '2rem 0'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎉</div>
        <h3 style={{ color: '#166534', margin: '0 0 0.5rem 0' }}>Thank you!</h3>
        <p style={{ color: '#15803d', margin: 0 }}>We've received your information and will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      background: 'var(--color-bg-secondary)',
      border: '1px solid var(--color-border)',
      borderRadius: '20px',
      margin: '2rem 0'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Subscribe to our Newsletter</h3>
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Get the latest AI insights delivered to your inbox.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              outline: 'none',
              background: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)'
            }}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              outline: 'none',
              background: 'var(--color-bg-primary)',
              color: 'var(--color-text-primary)'
            }}
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number (Optional)"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          style={{
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            border: '1px solid var(--color-border)',
            outline: 'none',
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)'
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary"
          style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
        >
          {status === 'loading' ? 'Submitting...' : 'Subscribe Now'}
        </button>
        {status === 'error' && (
          <p style={{ color: '#ef4444', textAlign: 'center', margin: 0, fontSize: '0.9rem' }}>Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
}
