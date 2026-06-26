import Link from 'next/link';
import { getHeroContent, getServices, getPortfolioProjects } from "@/actions/content";

export default async function Home() {
  const hero = await getHeroContent();
  const services = await getServices();
  const portfolio = await getPortfolioProjects();

  return (
    <>
      {/* Navigation - Simple & Clean */}
      <nav className="stealth-nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' }}>
            Anti Gravity 2.0
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="#services" className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Services</Link>
            <Link href="#work" className="text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>Work</Link>
            <Link href="#contact" className="btn-primary">Book Consultation</Link>
          </div>
        </div>
      </nav>

      {/* Hero - Simple & Bold */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '80px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <p className="text-accent" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {hero?.badgeText || "AI Automation Agency"}
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem', lineHeight: 1.15 }}>
            {hero?.headline || "We Build AI Systems That Grow Your Business"}
          </h1>
          <p className="text-muted" style={{ fontSize: '1.15rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: 1.7 }}>
            {hero?.description || "Websites, AI Agents, Automation Systems and Business Growth Solutions Built For The Future."}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="#contact" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              {hero?.button1Text || "Get Started"}
            </Link>
            <Link href="#services" className="btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}>
              {hero?.button2Text || "Our Services"}
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>What We Do</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>Simple solutions for complex problems.</p>
          </div>

          {services.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {services.map(service => (
                <div key={service.id} className="stealth-card">
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{service.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{service.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="stealth-card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>🌐 Website Development</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>Modern, fast, and responsive websites that convert visitors into customers.</p>
              </div>
              <div className="stealth-card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>🤖 AI Agents</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>Custom AI chatbots and agents that automate your business operations 24/7.</p>
              </div>
              <div className="stealth-card">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>⚡ Automation</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>End-to-end workflow automation to save time and eliminate repetitive tasks.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Portfolio / Work */}
      <section id="work" className="section" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Our Work</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>Projects we have built for our clients.</p>
          </div>

          {portfolio.length > 0 ? (
            <div className="portfolio-grid">
              {portfolio.map(proj => (
                <div key={proj.id} className="portfolio-item">
                  <div className="portfolio-image" style={{ backgroundImage: `url(${proj.imagePath})` }}></div>
                  <div className="portfolio-overlay">
                    <p className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{proj.category}</p>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{proj.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
              <p className="text-muted" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Projects will appear here.</p>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Add your work from the admin panel at <code>/login</code></p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form - Clean & Simple */}
      <section id="contact" className="section" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-bg-card)' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Book a Consultation</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>Fill out the form below and we will get back to you within 24 hours.</p>
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <input type="text" placeholder="Your Name" style={{ padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', color: 'var(--color-text-main)', fontSize: '0.95rem' }} />
            <input type="email" placeholder="Your Email" style={{ padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', color: 'var(--color-text-main)', fontSize: '0.95rem' }} />
            <input type="tel" placeholder="Phone Number (Optional)" style={{ padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', color: 'var(--color-text-main)', fontSize: '0.95rem' }} />
            <textarea rows={4} placeholder="Tell us about your project..." style={{ padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-base)', color: 'var(--color-text-main)', fontSize: '0.95rem', resize: 'vertical' }}></textarea>
            <button type="button" className="btn-primary" style={{ padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}>Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer style={{ borderTop: '1px solid var(--color-border)', padding: '2.5rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>© 2026 Anti Gravity 2.0. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="#services" className="text-muted" style={{ fontSize: '0.85rem' }}>Services</Link>
            <Link href="#work" className="text-muted" style={{ fontSize: '0.85rem' }}>Work</Link>
            <Link href="#contact" className="text-muted" style={{ fontSize: '0.85rem' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
