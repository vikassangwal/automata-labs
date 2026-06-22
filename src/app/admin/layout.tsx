'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
  { name: 'Dashboard', path: '/admin', icon: '📊' },
  { name: 'Blog Management', path: '/admin/blog', icon: '📝' },
  { name: 'AI Auto-Blogging', path: '/admin/auto-blog', icon: '🤖' },
  { name: 'CRM & Lead Management', path: '/admin/crm', icon: '💼' },
  { name: 'AI Outreach Hub', path: '/admin/outreach', icon: '📡' },
  { name: 'AI Agents', path: '/admin/agents', icon: '⚡' },
  { name: 'Services', path: '/admin/services', icon: '🛠️' },
  { name: 'Portfolio', path: '/admin/portfolio', icon: '🎨' },
  { name: 'Users & Roles', path: '/admin/users', icon: '👥' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState('Admin');

  useEffect(() => {
    // Fetch current user
    fetch('/api/auth/login', { method: 'GET' }).catch(() => {});
    
    // Connect to Server-Sent Events stream
    let eventSource: EventSource;
    try {
      eventSource = new EventSource('/api/alerts/stream');
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new-lead') {
            setToast({
              message: `🎯 New Lead: ${data.data.name} just contacted you!`,
              visible: true,
            });
            setTimeout(() => {
              setToast((prev) => (prev ? { ...prev, visible: false } : null));
            }, 5000);
          }
        } catch (err) {
          console.error('Failed to parse SSE data', err);
        }
      };
    } catch {}

    return () => {
      if (eventSource!) eventSource.close();
    };
  }, []);

  const handleLogout = () => {
    document.cookie = 'automata_auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/admin/login';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Toast Notification */}
      {toast?.visible && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#25D366',
              boxShadow: '0 0 12px #25D366',
              animation: 'pulse 1.5s infinite',
            }}
          />
          <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>{toast.message}</p>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .sidebar-link:hover {
          background: #f0f1f3;
          color: #1d1d1f;
        }
        .sidebar-link.active {
          background: linear-gradient(135deg, #0066cc15 0%, #0066cc08 100%);
          color: #0066cc;
          border-color: #0066cc20;
          font-weight: 600;
        }
        .sidebar-link .icon {
          font-size: 1.1rem;
          width: 24px;
          text-align: center;
        }
      `}</style>

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarCollapsed ? '80px' : '270px',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: sidebarCollapsed ? '1.5rem 0.75rem' : '1.5rem 1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #0066cc, #004999)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '1rem',
              flexShrink: 0,
            }}
          >
            AG
          </div>
          {!sidebarCollapsed && (
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '-0.3px', margin: 0, color: '#1d1d1f' }}>
                Anti Gravity
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 500 }}>Admin Panel</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav
          style={{
            flex: 1,
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            overflowY: 'auto',
          }}
        >
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path || 
              (item.path !== '/admin' && pathname?.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <span className="icon">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              width: '100%',
              padding: '0.6rem',
              background: '#f5f5f7',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              color: '#6b7280',
              fontWeight: 500,
              marginBottom: '0.75rem',
              transition: 'all 0.2s ease',
            }}
          >
            {sidebarCollapsed ? '→' : '← Collapse'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #1d1d1f, #333)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: '#1d1d1f' }}>{userName}</p>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    padding: 0,
                    fontWeight: 500,
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 2.5rem',
          maxHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  );
}
