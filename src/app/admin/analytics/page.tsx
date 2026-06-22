import React from 'react';

export default function AnalyticsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>Analytics & Reports</h1>
        <button className="btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>Download Report</button>
      </div>
      
      <div className="minimal-card" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', background: 'var(--color-bg-secondary)', border: '1px dashed var(--color-border)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Interactive Chart Component Placeholder (e.g. Recharts or Chart.js)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="minimal-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Top Source</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>Organic Search (Google)</p>
        </div>
        <div className="minimal-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Bounce Rate</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>24.5%</p>
        </div>
        <div className="minimal-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Avg. Session</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>3m 42s</p>
        </div>
      </div>
    </div>
  );
}
