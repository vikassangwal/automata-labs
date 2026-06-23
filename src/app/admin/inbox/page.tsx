'use client';
import React, { useState, useEffect } from 'react';

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [tab, setTab] = useState('inbox'); // inbox, settings
  const [settings, setSettings] = useState({
    emailUser: '',
    appPassword: '',
    imapHost: 'imap.gmail.com',
    smtpHost: 'smtp.gmail.com',
  });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inbox/sync?mode=fetch');
      const data = await res.json();
      if (res.ok) setMessages(data.messages);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/inbox/sync?mode=settings');
      const data = await res.json();
      if (res.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchMessages();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/inbox/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        alert(`Synced ${data.synced} new emails.`);
        fetchMessages();
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (e) {
      alert('Error syncing emails. Check your credentials.');
    }
    setSyncing(false);
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/inbox/sync?mode=settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Settings saved!');
      } else {
        alert('Error saving settings.');
      }
    } catch (e) {
      alert('Network error.');
    }
    setSavingSettings(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>AI Email Hub 📥</h1>
        {tab === 'inbox' && (
          <button 
            onClick={handleSync} 
            disabled={syncing}
            style={{ 
              background: '#0066cc', color: '#fff', padding: '0.8rem 1.5rem', 
              borderRadius: '8px', border: 'none', cursor: syncing ? 'not-allowed' : 'pointer', fontWeight: 600 
            }}
          >
            {syncing ? 'Syncing Emails...' : 'Sync Emails Now'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
        <button onClick={() => setTab('inbox')} style={{ padding: '0.5rem 1rem', background: tab === 'inbox' ? '#0066cc' : 'transparent', color: tab === 'inbox' ? '#fff' : 'var(--color-text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          Inbox
        </button>
        <button onClick={() => setTab('settings')} style={{ padding: '0.5rem 1rem', background: tab === 'settings' ? '#0066cc' : 'transparent', color: tab === 'settings' ? '#fff' : 'var(--color-text-secondary)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          IMAP/SMTP Settings
        </button>
      </div>

      {tab === 'settings' && (
        <div style={{ background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Connect Your Email Account</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            To allow the AI to read your incoming emails and send automatic replies, provide your IMAP/SMTP credentials. 
            If you are using Gmail, you must generate an <strong>App Password</strong>.
          </p>
          <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
              <input type="email" required value={settings.emailUser} onChange={(e) => setSettings({...settings, emailUser: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>App Password</label>
              <input type="password" required value={settings.appPassword} onChange={(e) => setSettings({...settings, appPassword: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} placeholder="xxxx xxxx xxxx xxxx" />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>IMAP Host</label>
                <input type="text" value={settings.imapHost} onChange={(e) => setSettings({...settings, imapHost: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>SMTP Host</label>
                <input type="text" value={settings.smtpHost} onChange={(e) => setSettings({...settings, smtpHost: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }} />
              </div>
            </div>
            <button type="submit" disabled={savingSettings} style={{ background: '#0066cc', color: '#fff', padding: '1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: '1rem' }}>
              {savingSettings ? 'Saving...' : 'Save Configuration'}
            </button>
          </form>
        </div>
      )}

      {tab === 'inbox' && (
        <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading emails...</div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              <p>No emails found.</p>
              <p style={{ fontSize: '0.8rem' }}>Make sure your IMAP settings are configured and click "Sync Emails Now".</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: msg.isRead ? 'transparent' : 'rgba(0, 102, 204, 0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: msg.isRead ? 500 : 700 }}>{msg.subject || '(No Subject)'}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{new Date(msg.date).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>From: <strong>{msg.from}</strong></div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', marginTop: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {msg.text?.substring(0, 150) || 'No text content'}...
                  </div>
                  {msg.isReplied && (
                    <div style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, marginTop: '0.5rem', width: 'fit-content' }}>
                      ✓ AI Replied
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
