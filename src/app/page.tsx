import Link from 'next/link';
import { getHeroContent, getServices, getPortfolioProjects, seedContentIfEmpty } from "@/actions/content";
import AgentVisualizer from '@/components/AgentVisualizer';

export default async function Home() {
  const hero = await getHeroContent();
  const services = await getServices();
  const portfolio = await getPortfolioProjects();

  return (
    <>
      <nav className="stealth-nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '24px', height: '24px', background: 'var(--color-text-main)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: '12px', height: '12px', background: 'var(--color-bg-base)', borderRadius: '2px' }}></div>
            </div>
            <span style={{ fontWeight: 600, fontSize: '1.1rem', letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
              Your Brand Name
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <Link href="#services" className="text-muted" style={{ transition: 'color 0.2s', fontSize: '0.9rem', fontWeight: 500 }}>Services</Link>
            <Link href="#portfolio" className="text-muted" style={{ transition: 'color 0.2s', fontSize: '0.9rem', fontWeight: 500 }}>Work</Link>
            <Link href="#agents" className="text-muted" style={{ transition: 'color 0.2s', fontSize: '0.9rem', fontWeight: 500 }}>Agents</Link>
            <Link href="#contact" className="btn-primary">Book Consultation</Link>
          </div>
        </div>
      </nav>

      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '100px' }}>
        <div className="bg-dot-grid"></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 1rem', borderRadius: '100px', border: '1px solid var(--color-border)', background: 'var(--color-bg-card)', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)' }}></span>
            {hero?.badgeText}
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', marginBottom: '1.5rem', maxWidth: '900px', margin: '0 auto 1.5rem auto' }} dangerouslySetInnerHTML={{ __html: hero?.headline?.replace("Autonomous", "<span style='color: var(--color-text-muted)'>Autonomous</span>") || "" }}>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            {hero?.description}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href={hero?.button1Link || "/login"} className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>{hero?.button1Text}</Link>
            <Link href={hero?.button2Link || "/admin"} className="btn-secondary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>{hero?.button2Text}</Link>
          </div>


        </div>
      </section>

      <section id="services" className="section" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}>
        <div className="container">
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Core Capabilities</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '600px' }}>Precision-engineered solutions for the modern technology stack.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services.map(service => (
              <div key={service.id} className="stealth-card">
                {service.iconSvg === "workflow" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>}
                {service.iconSvg === "code" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
                {service.iconSvg === "network" && <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>}
                
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{service.title}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="section" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-base)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Selected Work</h2>
              <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '500px' }}>Recent platforms and systems engineered for our clients.</p>
            </div>
            <button className="btn-secondary">View Complete Archive</button>
          </div>
          
          <div className="portfolio-grid">
            {portfolio.map(proj => (
              <div key={proj.id} className={`portfolio-item ${proj.gridClass}`}>
                <div className="portfolio-image" style={{ backgroundImage: `url(${proj.imagePath})` }}></div>
                <div className="portfolio-overlay">
                  <p className="text-accent" style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{proj.category}</p>
                  <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>{proj.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="agents" className="section" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-base)', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.8rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', marginBottom: '1.5rem', fontSize: '0.8rem', fontWeight: 500 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              Agentic Framework
            </div>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Your Custom Title</h2>
            <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.8' }}>
              Your section description goes here. This text is hardcoded in the code and can be updated to match your actual services.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-accent)' }}></div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Feature 1</h4>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Feature description goes here.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text-main)' }}></div>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Feature 2</h4>
                  <p className="text-muted" style={{ fontSize: '0.9rem' }}>Feature description goes here.</p>
                </div>
              </div>
            </div>
            <button className="btn-primary">Explore Architecture</button>
          </div>
          
          <div style={{ position: 'relative', width: '100%' }}>
            <AgentVisualizer />
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '4rem 0', background: 'var(--color-bg-base)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '16px', height: '16px', background: 'var(--color-text-main)', borderRadius: '2px' }}></div>
              <span style={{ fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
                Your Brand Name
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>© 2026 Your Brand Name. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="#services" className="text-muted" style={{ fontSize: '0.85rem', transition: 'color 0.2s' }}>Services</Link>
            <Link href="#portfolio" className="text-muted" style={{ fontSize: '0.85rem', transition: 'color 0.2s' }}>Work</Link>
            <Link href="#agents" className="text-muted" style={{ fontSize: '0.85rem', transition: 'color 0.2s' }}>Agents</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
