'use client';
import React, { useEffect, useState } from 'react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/portfolio')
      .then(async (res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ marginBottom: '4rem' }}>
        <h1 className="animate-slide-up" style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
          Our Work
        </h1>
        <p className="animate-slide-up delay-1 text-gray" style={{ fontSize: '1.2rem', maxWidth: '600px', color: 'var(--color-text-secondary)' }}>
          Explore our recent projects spanning across multiple industries and use cases.
        </p>
      </div>

      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-secondary)' }}>
              No projects available yet. Admin needs to add them.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '3rem' }}>
              {projects.map((project, index) => (
                <div key={project.id || index} className={`minimal-card animate-slide-up delay-${(index % 3) + 1}`} style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'var(--color-bg-primary)' }}>
                  <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>{project.category}</p>
                    <h3 style={{ fontSize: '1.5rem' }}>{project.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
