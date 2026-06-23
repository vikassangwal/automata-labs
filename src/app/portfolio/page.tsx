import React from 'react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function PortfolioPage() {
  const DEFAULT_PROJECTS = [
    { id: '1', title: 'Automata Labs', category: 'AI & SaaS', websiteLink: 'https://automata-labs.vercel.app/', imageUrl: 'https://image.thum.io/get/width/800/crop/600/https://automata-labs.vercel.app/' },
    { id: '2', title: 'AI Booking Agent', category: 'AI Automation', websiteLink: 'https://ai-booking-agent-r2go.onrender.com/', imageUrl: 'https://image.thum.io/get/width/800/crop/600/https://ai-booking-agent-r2go.onrender.com/' },
    { id: '3', title: 'Study FinTech', category: 'EdTech', websiteLink: 'https://studyfintech.vercel.app/', imageUrl: 'https://image.thum.io/get/width/800/crop/600/https://studyfintech.vercel.app/' },
    { id: '4', title: 'VK Fort', category: 'Corporate & Security', websiteLink: 'https://vkfort.vercel.app/', imageUrl: 'https://image.thum.io/get/width/800/crop/600/https://vkfort.vercel.app/' }
  ];

  let dbProjects = [];
  try {
    dbProjects = await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Failed to fetch portfolio projects', error);
  }

  const projects = [...DEFAULT_PROJECTS, ...dbProjects];


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
                <div key={project.id || index} className={`minimal-card animate-slide-up delay-${(index % 3) + 1}`} style={{ height: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'var(--color-bg-primary)', position: 'relative', overflow: 'hidden', backgroundImage: `url(${project.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center top' }}>
                  {project.websiteLink && (
                    <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}></a>
                  )}
                  <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', zIndex: 5, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{project.category}</p>
                    <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                    {project.websiteLink && (
                      <span style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Visit Website <span>→</span>
                      </span>
                    )}
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
