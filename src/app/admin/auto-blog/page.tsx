'use client';
import React, { useEffect, useState } from 'react';

export default function AutoBlogAdmin() {
  const [settings, setSettings] = useState<any>(null);
  const [stats, setStats] = useState<any>({});
  const [logs, setLogs] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [newKeywords, setNewKeywords] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const fetchData = async () => {
    try {
      const [settingsRes, autoBlogRes, keywordsRes] = await Promise.all([
        fetch('/api/auto-blog/settings'),
        fetch('/api/auto-blog'),
        fetch('/api/auto-blog/keywords?limit=10')
      ]);
      const settingsData = await settingsRes.json();
      const autoBlogData = await autoBlogRes.json();
      const keywordsData = await keywordsRes.json();

      setSettings(settingsData);
      setStats(autoBlogData.stats || {});
      setLogs(autoBlogData.logs || []);
      setKeywords(keywordsData.keywords || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await fetch('/api/auto-blog/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      alert('Settings saved');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const addKeywords = async () => {
    if (!newKeywords.trim()) return;
    try {
      await fetch('/api/auto-blog/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: newKeywords, niche: 'General', priority: 1 })
      });
      setNewKeywords('');
      fetchData();
    } catch (error) {
      alert('Failed to add keywords');
    }
  };

  const deleteKeyword = async (id: string) => {
    try {
      await fetch(`/api/auto-blog/keywords?id=${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const triggerRun = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('/api/auto-blog', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'empty') {
        alert('No pending keywords found');
      } else if (data.success) {
        alert('Auto-blog generated successfully!');
        fetchData();
      } else {
        alert('Auto-blog failed: ' + data.error);
      }
    } catch (error) {
      alert('Auto-blog trigger failed');
    } finally {
      setIsRunning(false);
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#111827' }}>AI Auto-Blogging</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Configure and monitor your automated content pipeline.</p>
        </div>
        <button 
          onClick={triggerRun} 
          disabled={isRunning}
          style={{ background: 'linear-gradient(135deg, #0066cc, #004999)', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: isRunning ? 'not-allowed' : 'pointer', opacity: isRunning ? 0.7 : 1 }}
        >
          {isRunning ? 'Running...' : '▶ Run Now (Force Trigger)'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 0.5rem', color: '#6b7280', fontWeight: 600 }}>Total Keywords</p>
          <h3 style={{ margin: 0, fontSize: '2rem' }}>{stats.totalKeywords || 0}</h3>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 0.5rem', color: '#6b7280', fontWeight: 600 }}>Pending Queue</p>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#0066cc' }}>{stats.pendingKeywords || 0}</h3>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 0.5rem', color: '#6b7280', fontWeight: 600 }}>Completed</p>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#059669' }}>{stats.usedKeywords || 0}</h3>
        </div>
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ margin: '0 0 0.5rem', color: '#6b7280', fontWeight: 600 }}>Auto Posts Generated</p>
          <h3 style={{ margin: 0, fontSize: '2rem', color: '#9333ea' }}>{stats.totalAutoPosts || 0}</h3>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Settings */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Automation Settings</h2>
          <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="checkbox"
                id="isActive"
                checked={settings.isActive}
                onChange={e => setSettings({ ...settings, isActive: e.target.checked })}
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor="isActive" style={{ fontWeight: 600 }}>Enable Auto-Blogging</label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Frequency</label>
              <select
                value={settings.frequency}
                onChange={e => setSettings({ ...settings, frequency: e.target.value })}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Posts Per Run</label>
                <input
                  type="number"
                  value={settings.maxPostsPerRun}
                  onChange={e => setSettings({ ...settings, maxPostsPerRun: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Max Posts/Day</label>
                <input
                  type="number"
                  value={settings.maxPostsPerDay}
                  onChange={e => setSettings({ ...settings, maxPostsPerDay: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>Featured Image Source</label>
              <select
                value={settings.imageSource}
                onChange={e => setSettings({ ...settings, imageSource: e.target.value })}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              >
                <option value="unsplash">Unsplash (Auto-fetch)</option>
                <option value="none">None</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="checkbox"
                id="autoPublish"
                checked={settings.autoPublish}
                onChange={e => setSettings({ ...settings, autoPublish: e.target.checked })}
                style={{ width: '20px', height: '20px' }}
              />
              <label htmlFor="autoPublish" style={{ fontWeight: 600 }}>Publish immediately (otherwise Draft)</label>
            </div>

            <button type="submit" disabled={isSaving} className="btn-primary">
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Keyword Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Add Keywords</h2>
            <textarea
              value={newKeywords}
              onChange={e => setNewKeywords(e.target.value)}
              placeholder="Enter topics, one per line..."
              style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e5e7eb', minHeight: '100px', marginBottom: '1rem' }}
            />
            <button onClick={addKeywords} style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', padding: '0.6rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
              + Add to Queue
            </button>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', flex: 1 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Up Next</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {keywords.filter(k => k.status === 'pending').slice(0, 5).map(kw => (
                <div key={kw.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontWeight: 500 }}>{kw.keyword}</span>
                  <button onClick={() => deleteKeyword(kw.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
              {keywords.filter(k => k.status === 'pending').length === 0 && (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>Queue is empty.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
