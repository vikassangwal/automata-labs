'use client';
import React, { useState, useEffect } from 'react';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add User State
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addMsg, setAddMsg] = useState('');
  const [adding, setAdding] = useState(false);

  // Change Password State
  const [changeEmail, setChangeEmail] = useState('admin@automata.com'); // Default to master admin
  const [newPassword, setNewPassword] = useState('');
  const [changeMsg, setChangeMsg] = useState('');
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch { console.error('Failed to load users'); }
    setLoading(false);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true); setAddMsg('');
    try {
      const res = await fetch('/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName, email: addEmail, password: addPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setAddMsg('User added successfully!');
        setAddName(''); setAddEmail(''); setAddPassword('');
        fetchUsers();
      } else {
        setAddMsg(data.error || 'Failed to add user');
      }
    } catch { setAddMsg('Network error'); }
    setAdding(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChanging(true); setChangeMsg('');
    try {
      const res = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: changeEmail, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setChangeMsg('Password updated securely!');
        setNewPassword('');
      } else {
        setChangeMsg(data.error || 'Failed to update');
      }
    } catch { setChangeMsg('Network error'); }
    setChanging(false);
  };

  const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-bg-secondary)', marginBottom: '1rem' };
  const labelStyle = { display: 'block', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--color-text-secondary)' };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Users & Security</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Manage admin access and credentials securely.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        
        {/* ADD USER CARD */}
        <div className="minimal-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>+ Add New Admin</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Only existing admins can invite new users to the platform.</p>
          
          <form onSubmit={handleAddUser}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" required value={addName} onChange={e => setAddName(e.target.value)} placeholder="e.g. Jane Doe" style={inputStyle} />
            
            <label style={labelStyle}>Email Address</label>
            <input type="email" required value={addEmail} onChange={e => setAddEmail(e.target.value)} placeholder="jane@automata.com" style={inputStyle} />
            
            <label style={labelStyle}>Secure Password</label>
            <input type="password" required value={addPassword} onChange={e => setAddPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
            
            {addMsg && <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: addMsg.includes('error') || addMsg.includes('Failed') ? '#c62828' : '#2e7d32' }}>{addMsg}</p>}
            
            <button type="submit" disabled={adding} className="btn-primary" style={{ padding: '0.8rem 1.5rem', opacity: adding ? 0.6 : 1 }}>
              {adding ? 'Adding...' : 'Create Admin Account'}
            </button>
          </form>
        </div>

        {/* CHANGE PASSWORD CARD */}
        <div className="minimal-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Change Password</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Update credentials for an existing admin account.</p>
          
          <form onSubmit={handleChangePassword}>
            <label style={labelStyle}>Admin Email</label>
            <select value={changeEmail} onChange={e => setChangeEmail(e.target.value)} style={inputStyle}>
              {users.map(u => <option key={u.id} value={u.email}>{u.name} ({u.email})</option>)}
              {users.length === 0 && <option value="admin@automata.com">admin@automata.com</option>}
            </select>
            
            <label style={labelStyle}>New Password</label>
            <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New strong password" style={inputStyle} />
            
            {changeMsg && <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: changeMsg.includes('error') || changeMsg.includes('Failed') ? '#c62828' : '#2e7d32' }}>{changeMsg}</p>}
            
            <button type="submit" disabled={changing} className="btn-primary" style={{ padding: '0.8rem 1.5rem', opacity: changing ? 0.6 : 1 }}>
              {changing ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      {/* ACTIVE USERS LIST */}
      <div className="minimal-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Active Administrators</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--color-bg-secondary)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Name</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Email</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Role</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.9rem' }}>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{user.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{user.email}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', background: user.role === 'SUPER_ADMIN' ? '#e3f2fd' : 'var(--color-bg-secondary)', color: user.role === 'SUPER_ADMIN' ? '#1565c0' : 'var(--color-text-primary)', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
