'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/blog?limit=5').then(r => r.json()),
      fetch('/api/leads?limit=5').then(r => r.json()),
      fetch('/api/auto-blog').then(r => r.json())
    ]).then(([blogData, leadsData, autoBlogData]) => {
      setStats({
        totalPosts: blogData.total || 0,
        totalLeads: leadsData.total || 0,
        autoBlogActive: autoBlogData.stats?.totalAutoPosts !== undefined, // simple check
        totalAutoPosts: autoBlogData.stats?.totalAutoPosts || 0
      });
      setRecentPosts(blogData.posts || []);
      setRecentLeads(leadsData.leads || []);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  const StatCard = ({ title, value, icon, color }: any) => (
    <div style={{
      background: '#fff',
      padding: '1.5rem',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    }}>
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.8rem'
      }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6b7280', fontWeight: 600 }}>{title}</h3>
        <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#111827', lineHeight: 1 }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#111827' }}>Dashboard</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Welcome back to Anti Gravity 2.0</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/blog/new" className="btn-primary" style={{ textDecoration: 'none' }}>
            + New Post
          </Link>
          <Link href="/admin/auto-blog" className="btn-secondary" style={{ textDecoration: 'none' }}>
            🤖 AI Settings
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Total Posts" value={stats?.totalPosts} icon="📝" color="#eff6ff" />
        <StatCard title="AI Generated Posts" value={stats?.totalAutoPosts} icon="✨" color="#f5f3ff" />
        <StatCard title="Total Leads" value={stats?.totalLeads} icon="🎯" color="#ecfdf5" />
        <StatCard title="Auto-Blog Status" value={stats?.autoBlogActive ? 'Active' : 'Paused'} icon="🤖" color={stats?.autoBlogActive ? '#dcfce7' : '#fee2e2'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Posts */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Recent Posts</h2>
            <Link href="/admin/blog" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentPosts.map(post => (
              <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600 }}>{post.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {post.status} • {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Link href={`/admin/blog/edit?slug=${post.slug}`} style={{ padding: '0.4rem 0.8rem', background: '#f3f4f6', borderRadius: '6px', color: '#374151', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>
                  Edit
                </Link>
              </div>
            ))}
            {recentPosts.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>No posts yet.</p>}
          </div>
        </div>

        {/* Recent Leads */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Recent Leads</h2>
            <Link href="/admin/leads" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentLeads.map(lead => (
              <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600 }}>{lead.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{lead.email}</span>
                </div>
                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: '#ecfdf5', color: '#059669', borderRadius: '10px', fontWeight: 600 }}>
                  {lead.source}
                </span>
              </div>
            ))}
            {recentLeads.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem 0' }}>No leads yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
