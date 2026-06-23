import React from 'react';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // Enable ISR (cache for 60 seconds)

export default async function Home() {
  // Fetch About content
  const aboutSetting = await prisma.aboutSetting.findUnique({ where: { id: 'default' } });
  
  // Default fallbacks if none set
  const aboutHeading = aboutSetting?.heading || "About Us";
  const aboutContent = aboutSetting?.content || "We build enterprise-grade automation systems and AI agents that handle your operations, so you can focus on growth.";
  const aboutMission = aboutSetting?.mission || "";
  return (
    <main>
      {/* Sleek Hero Section */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '80px' }}>
        <div className="bg-mesh"></div>
        
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <div className="animate-slide-up" style={{ 
            display: 'inline-block', 
            padding: '0.4rem 1.2rem', 
            borderRadius: '50px', 
            border: '1px solid var(--color-border)', 
            background: 'var(--color-bg-primary)', 
            marginBottom: '2rem', 
            fontSize: '0.9rem', 
            fontWeight: 500,
            color: 'var(--color-text-secondary)'
          }}>
            Introducing Automata Intelligence OS
          </div>
          
          <h1 className="animate-slide-up delay-1" style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-2px' }}>
            Work less.<br />
            Accomplish <span style={{ color: 'var(--color-accent)' }}>everything.</span>
          </h1>
          
          <p className="text-gray animate-slide-up delay-2" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', color: 'var(--color-text-secondary)' }}>
            We build enterprise-grade automation systems and AI agents that handle your operations, so you can focus on growth.
          </p>
          
          <div className="animate-slide-up delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-primary">Start Automating</button>
            <button className="btn-secondary">View Case Studies</button>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="section" style={{ background: 'var(--color-bg-primary)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="animate-slide-up" style={{ 
              display: 'inline-block', 
              padding: '0.4rem 1.2rem', 
              borderRadius: '50px', 
              border: '1px solid var(--color-border)', 
              background: 'var(--color-bg-secondary)', 
              marginBottom: '1.5rem', 
              fontSize: '0.85rem', 
              fontWeight: 600,
              color: 'var(--color-text-secondary)'
            }}>
              {aboutHeading}
            </div>
            
            <h2 className="animate-slide-up delay-1" style={{ fontSize: '2.5rem', marginBottom: '2rem', letterSpacing: '-1px', lineHeight: 1.2 }}>
              {aboutContent}
            </h2>
            
            {aboutMission && (
              <p className="text-gray animate-slide-up delay-2" style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                <strong>Our Mission:</strong> {aboutMission}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Minimalist Stats Section */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
            <div className="minimal-card animate-slide-up">
              <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>99%</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Tasks Automated</p>
            </div>
            <div className="minimal-card animate-slide-up delay-1">
              <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>150+</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Enterprise Clients</p>
            </div>
            <div className="minimal-card animate-slide-up delay-2">
              <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>24/7</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>System Uptime</p>
            </div>
            <div className="minimal-card animate-slide-up delay-3">
              <h2 style={{ fontSize: '3rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>10x</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>ROI Delivered</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
