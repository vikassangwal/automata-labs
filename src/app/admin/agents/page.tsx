'use client';
import React, { useState } from 'react';

export default function AgentsManagementPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');

  // Dynamic Routing States
  const [auditModel, setAuditModel] = useState('');
  const [emailModel, setEmailModel] = useState('');

  // Email States
  const [email, setEmail] = useState('');
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError('');
    setReport('');
    setEmailStatus('');
    setEmailDraft('');

    try {
      const res = await fetch('/api/agents/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: url.startsWith('http') ? url : `https://${url}`,
          auditModel 
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setReport(data.report);
      } else {
        setError(data.error || 'Failed to audit website');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;
    setGeneratingDraft(true);
    setEmailStatus('');
    setEmailDraft('');

    try {
      const res = await fetch('/api/agents/audit/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          websiteUrl: url, 
          report,
          emailModel 
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setEmailDraft(data.draft);
      } else {
        setEmailStatus(`❌ ${data.error || 'Failed to generate draft'}`);
      }
    } catch (err) {
      setEmailStatus('❌ Network error. Please try again.');
    }
    setGeneratingDraft(false);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !emailDraft) return;
    setSending(true);
    setEmailStatus('');

    try {
      const res = await fetch('/api/agents/audit/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: email, websiteUrl: url, emailDraft }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setEmailStatus('✅ Email sent successfully to the prospect!');
      } else {
        setEmailStatus(`❌ ${data.error || 'Failed to send email'}`);
      }
    } catch (err) {
      setEmailStatus('❌ Network error. Please try again.');
    }
    setSending(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>AI Agents</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Deploy specialized AI agents to automate your workflow.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Website Auditor Agent */}
        <div className="minimal-card" style={{ padding: '2rem', borderTop: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>🕵️‍♂️</div>
            <div>
              <h2 style={{ fontSize: '1.4rem' }}>Website Auditor & Outreach Engine</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>Status: <span style={{ color: '#34c759', fontWeight: 600 }}>● Active</span></p>
            </div>
          </div>
          
          <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
            Enter any website URL. This AI will crawl the site, generate a brutal audit report, and let you instantly draft and send a highly personalized cold email pitching our services to fix those exact flaws.
          </p>

          {/* Dynamic AI Routing Settings */}
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', background: 'var(--color-bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Auditor Model</label>
              <select 
                value={auditModel} 
                onChange={(e) => setAuditModel(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              >
                <option value="">Default Setting</option>
                <option value="openai:gpt-4o-mini">OpenAI GPT-4o Mini</option>
                <option value="openai:gpt-4o">OpenAI GPT-4o (Vision/Expert)</option>
                <option value="deepseek:deepseek-chat">DeepSeek Chat (Fast Logic)</option>
                <option value="anthropic:claude-3-haiku-20240307">Claude 3 Haiku</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Email Copywriter Model</label>
              <select 
                value={emailModel} 
                onChange={(e) => setEmailModel(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid var(--color-border)', background: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}
              >
                <option value="">Default Setting</option>
                <option value="openai:gpt-4o-mini">OpenAI GPT-4o Mini</option>
                <option value="deepseek:deepseek-chat">DeepSeek Chat</option>
                <option value="openrouter:meta-llama/llama-3-70b-instruct">Llama 3 70B (OpenRouter)</option>
                <option value="gemini:gemini-pro">Google Gemini Pro</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleAudit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              placeholder="https://example.com" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              style={{ 
                flex: 1, 
                padding: '1rem', 
                borderRadius: '8px', 
                border: '1px solid var(--color-border)', 
                background: 'var(--color-bg-secondary)',
                fontSize: '1rem',
                outline: 'none'
              }} 
            />
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ padding: '0 2rem', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Auditing Website...' : '1. Start Audit'}
            </button>
          </form>

          {error && (
            <div style={{ padding: '1rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', marginBottom: '1rem' }}>
              ⚠️ {error}
            </div>
          )}

          {report && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#8b5cf6' }}>📄 Step 2: AI Audit Report</h3>
              <div 
                style={{ 
                  background: 'var(--color-bg-secondary)', 
                  padding: '2rem', 
                  borderRadius: '12px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  fontFamily: 'system-ui, sans-serif',
                  marginBottom: '2rem',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}
              >
                {report}
              </div>

              {/* Email Prospect Section */}
              <div style={{ padding: '2rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', border: '1px dashed #8b5cf6' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📧 Step 3: Cold Email Outreach
                </h4>
                
                {!emailDraft ? (
                  <button 
                    onClick={handleGenerateDraft}
                    disabled={generatingDraft}
                    className="btn-primary" 
                    style={{ padding: '0.8rem 1.5rem', opacity: generatingDraft ? 0.7 : 1, background: '#8b5cf6', borderColor: '#8b5cf6' }}
                  >
                    {generatingDraft ? 'AI is writing...' : 'Generate Personalized Pitch 🪄'}
                  </button>
                ) : (
                  <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Review Email Draft (Edit if needed):</label>
                      <textarea 
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                        style={{
                          width: '100%',
                          minHeight: '200px',
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-border)',
                          fontFamily: 'system-ui, sans-serif',
                          lineHeight: '1.5'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Prospect Email Address:</label>
                        <input 
                          type="email" 
                          placeholder="ceo@company.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{ 
                            width: '100%', 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            border: '1px solid var(--color-border)', 
                            outline: 'none'
                          }} 
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={sending}
                        className="btn-primary" 
                        style={{ padding: '1rem 2rem', opacity: sending ? 0.7 : 1, background: '#10b981', borderColor: '#10b981' }}
                      >
                        {sending ? 'Sending...' : 'Confirm & Send 🚀'}
                      </button>
                    </div>
                  </form>
                )}

                {emailStatus && (
                  <p style={{ marginTop: '1rem', fontSize: '1rem', fontWeight: 500, color: emailStatus.includes('✅') ? '#059669' : '#dc2626' }}>
                    {emailStatus}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Coming Soon Agents */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="minimal-card" style={{ opacity: 0.6 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>🤖 Social Media Manager Agent</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Status: Paused (Coming Soon)</p>
          </div>
          <div className="minimal-card" style={{ opacity: 0.6 }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>📞 Support Chatbot Agent</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Status: Paused (Coming Soon)</p>
          </div>
        </div>

      </div>
    </div>
  );
}
