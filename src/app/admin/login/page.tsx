'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      router.push('/admin');
    } catch { setError('Network error'); setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '1rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)', fontFamily: 'inherit', outline: 'none' };
  const labelStyle = { color: 'var(--color-text-secondary)', fontSize: '0.85rem', display: 'block' as const, marginBottom: '0.5rem', fontWeight: 500 as const };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)' }}>
      <div className="minimal-card animate-slide-up" style={{ width: '100%', maxWidth: '460px', padding: '3rem', background: 'var(--color-bg-primary)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--color-text-primary)', borderRadius: '8px' }}></div>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Automata OS</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Sign in to your admin account
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@automata.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
          </div>
          {error && <p style={{ color: '#ff3b30', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '1rem', borderRadius: '12px', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}
