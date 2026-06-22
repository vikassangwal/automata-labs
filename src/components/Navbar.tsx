'use client';
import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ 
      position: 'fixed', 
      top: 0, 
      width: '100%', 
      zIndex: 100, 
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--color-border)',
      padding: '1rem 0'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '20px', height: '20px', background: 'var(--color-text-primary)', borderRadius: '4px' }}></div>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
            Automata Labs.
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
          <Link href="/services" style={{ color: 'var(--color-text-secondary)' }}>Services</Link>
          <Link href="/agents" style={{ color: 'var(--color-text-secondary)' }}>AI Agents</Link>
          <Link href="/portfolio" style={{ color: 'var(--color-text-secondary)' }}>Portfolio</Link>
          <Link href="#about" style={{ color: 'var(--color-text-secondary)' }}>About</Link>
          <Link href="/contact" className="btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', textDecoration: 'none' }}>
            Get in touch
          </Link>
        </div>
      </div>
    </nav>
  );
}
