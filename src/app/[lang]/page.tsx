import Link from 'next/link';
import { getServices, getPortfolioProjects } from "@/actions/content";
import { getDictionary, Locale } from '@/i18n/dictionaries';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function Home({ params }: { params: { lang: Locale } }) {
  const services = await getServices();
  const portfolio = await getPortfolioProjects();
  
  // Resolve the dictionary based on the URL param
  const dict = await getDictionary(params.lang);

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <nav className="site-nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href={`/${params.lang}`} style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0a0a0a' }}>
            {dict.nav.brand}
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="#services" className="hide-mobile" style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>{dict.nav.services}</Link>
            <Link href="#work" className="hide-mobile" style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>{dict.nav.work}</Link>
            <LanguageSwitcher />
            <Link href="#contact" className="btn btn-blue" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>{dict.nav.bookConsultation}</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            {dict.hero.badge}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '1.25rem' }}>
            {dict.hero.headline}
          </h1>

          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            {dict.hero.description}
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="#contact" className="btn btn-blue" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
              {dict.hero.cta1}
            </Link>
            <Link href="#services" className="btn btn-outline" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
              {dict.hero.cta2}
            </Link>
          </div>

          {/* Trust Indicators */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>50+</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>{dict.hero.trust1}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>24/7</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>{dict.hero.trust2}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>100%</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>{dict.hero.trust3}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dict.services.title}</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>{dict.services.subtitle}</p>
          </div>

          {services.length > 0 ? (
            <div className="service-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {services.map(service => (
                <div key={service.id} className="service-card">
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{service.title}</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{service.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="service-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div className="service-card">
                <div className="service-icon" style={{ background: '#eff6ff' }}>🌐</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{dict.services.default1Title}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{dict.services.default1Desc}</p>
              </div>
              <div className="service-card">
                <div className="service-icon" style={{ background: '#f0fdf4' }}>🤖</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{dict.services.default2Title}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{dict.services.default2Desc}</p>
              </div>
              <div className="service-card">
                <div className="service-icon" style={{ background: '#fefce8' }}>⚡</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{dict.services.default3Title}</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{dict.services.default3Desc}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '5rem 0', background: '#f9fafb', borderTop: '1px solid #f0f0f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dict.howItWorks.title}</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>{dict.howItWorks.subtitle}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.2rem', fontWeight: 700 }}>1</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{dict.howItWorks.step1Title}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{dict.howItWorks.step1Desc}</p>
            </div>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.2rem', fontWeight: 700 }}>2</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{dict.howItWorks.step2Title}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{dict.howItWorks.step2Desc}</p>
            </div>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.2rem', fontWeight: 700 }}>3</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{dict.howItWorks.step3Title}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{dict.howItWorks.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO ─── */}
      <section id="work" style={{ padding: '5rem 0', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dict.portfolio.title}</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>{dict.portfolio.subtitle}</p>
          </div>

          {portfolio.length > 0 ? (
            <div className="work-grid">
              {portfolio.map(proj => (
                <div key={proj.id} className="work-card">
                  <div className="work-card-img" style={{ backgroundImage: `url(${proj.imagePath})` }}></div>
                  <div className="work-card-body">
                    <p style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{proj.category}</p>
                    <h3 style={{ fontSize: '1.1rem' }}>{proj.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#f9fafb', borderRadius: '16px', border: '2px dashed #e5e5e5' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📂</p>
              <p style={{ fontSize: '1rem', color: '#555', marginBottom: '0.25rem' }}>{dict.portfolio.emptyTitle}</p>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{dict.portfolio.emptySubtitle}</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section id="contact" style={{ padding: '5rem 0', background: '#f9fafb', borderTop: '1px solid #f0f0f0' }}>
        <div className="container" style={{ maxWidth: '550px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{dict.contact.title}</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>{dict.contact.subtitle}</p>
          </div>

          <form action="mailto:hello@antigravity.com" method="post" encType="text/plain" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <input type="text" name="Name" className="form-input" placeholder={dict.contact.namePlaceholder} />
            <input type="email" name="Email" className="form-input" placeholder={dict.contact.emailPlaceholder} />
            <input type="tel" name="Phone" className="form-input" placeholder={dict.contact.phonePlaceholder} />
            <select name="Service" className="form-input" style={{ color: '#aaa' }}>
              <option value="">{dict.contact.serviceSelect}</option>
              <option value="Website">{dict.contact.serviceOpt1}</option>
              <option value="Chatbot">{dict.contact.serviceOpt2}</option>
              <option value="Automation">{dict.contact.serviceOpt3}</option>
              <option value="Other">{dict.contact.serviceOpt4}</option>
            </select>
            <textarea name="Message" className="form-input" rows={3} placeholder={dict.contact.messagePlaceholder} style={{ resize: 'vertical' }}></textarea>
            <button type="submit" className="btn btn-blue" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              {dict.contact.submitBtn}
            </button>
            <p className="text-muted" style={{ fontSize: '0.8rem', textAlign: 'center' }}>{dict.contact.footerNote}</p>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: '2rem 0', borderTop: '1px solid #eee', background: '#fff' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>{dict.footer.copyright}</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="#services" style={{ fontSize: '0.85rem', color: '#999' }}>{dict.nav.services}</Link>
            <Link href="#work" style={{ fontSize: '0.85rem', color: '#999' }}>{dict.nav.work}</Link>
            <Link href="#contact" style={{ fontSize: '0.85rem', color: '#999' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
