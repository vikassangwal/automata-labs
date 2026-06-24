'use client';
import React from 'react';
import Link from 'next/link';

export default function Footer({ siteName = "Automata Labs." }: { siteName?: string }) {
  return (
    <footer style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', padding: '4rem 0 2rem 0', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand Column */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'var(--color-text-primary)' }}></div>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
                {siteName}
              </span>
            </Link>
            <p className="text-gray" style={{ fontSize: '0.9rem', maxWidth: '300px', color: 'var(--color-text-secondary)' }}>
              Building the future of business automation through enterprise-grade AI systems, intelligent chatbots, and scalable software.
            </p>
          </div>

          {/* Links Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>Platform</h4>
            <Link href="/services" className="text-gray" style={{ fontSize: '0.9rem', transition: 'color 0.3s' }}>Services</Link>
            <Link href="/agents" className="text-gray" style={{ fontSize: '0.9rem', transition: 'color 0.3s' }}>AI Agents</Link>
            <Link href="/portfolio" className="text-gray" style={{ fontSize: '0.9rem', transition: 'color 0.3s' }}>Portfolio</Link>
            <Link href="/admin" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-accent)' }}>Admin Login</Link>
          </div>

          {/* Links Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: 'var(--color-text-white)', marginBottom: '0.5rem' }}>Company</h4>
            <Link href="#about" className="text-gray" style={{ fontSize: '0.9rem', transition: 'color 0.3s' }}>About Us</Link>
            <Link href="#careers" className="text-gray" style={{ fontSize: '0.9rem', transition: 'color 0.3s' }}>Careers</Link>
            <Link href="#contact" className="text-gray" style={{ fontSize: '0.9rem', transition: 'color 0.3s' }}>Contact</Link>
          </div>

          {/* Socials / Newsletter */}
          <div>
            <h4 style={{ color: 'var(--color-text-white)', marginBottom: '1.5rem' }}>Stay Updated</h4>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input type="email" placeholder="Enter your email" style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', flex: 1, fontSize: '0.8rem' }} />
              <button className="btn-primary" style={{ padding: '0.8rem', borderRadius: '8px', fontSize: '0.8rem' }}>Join</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="text-gray" style={{ fontSize: '0.8rem' }}>&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span className="text-gray" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>Privacy Policy</span>
            <span className="text-gray" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
