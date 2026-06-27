import Link from 'next/link';
import { getServices, getPortfolioProjects } from "@/actions/content";

export default async function Home() {
  const services = await getServices();
  const portfolio = await getPortfolioProjects();

  return (
    <>
      {/* ─── NAVBAR ─── */}
      <nav className="site-nav">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0a0a0a' }}>
            ⚡ Anti Gravity 2.0
          </Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="#services" className="hide-mobile" style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Services</Link>
            <Link href="#work" className="hide-mobile" style={{ fontSize: '0.9rem', color: '#555', fontWeight: 500 }}>Work</Link>
            <Link href="#contact" className="btn btn-blue" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>Book Consultation →</Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '700px' }}>
          
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            🚀 AI Automation Agency
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', marginBottom: '1.25rem' }}>
            We Build Websites, AI Agents &amp; Automation Systems
          </h1>

          <p className="text-muted" style={{ fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Apne business ko grow karne ke liye modern technology ka use karein. 
            Hum websites, AI chatbots aur automation systems banate hain.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="#contact" className="btn btn-blue" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
              Free Consultation Book Karein
            </Link>
            <Link href="#services" className="btn btn-outline" style={{ padding: '0.85rem 2.2rem', fontSize: '1rem' }}>
              Humari Services Dekhein
            </Link>
          </div>

          {/* Trust Indicators */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>50+</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>Projects Done</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>24/7</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>AI Support</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0a0a' }}>100%</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section id="services" style={{ padding: '5rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Hum Kya Karte Hain?</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>Yeh services hum apne clients ko provide karte hain</p>
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
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Website Development</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Modern, fast websites jo mobile par bhi perfectly kaam karein aur customers ko attract karein.</p>
              </div>
              <div className="service-card">
                <div className="service-icon" style={{ background: '#f0fdf4' }}>🤖</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>AI Chatbot &amp; Agents</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>AI chatbot jo 24/7 aapke customers se baat kare aur automatically leads generate kare.</p>
              </div>
              <div className="service-card">
                <div className="service-icon" style={{ background: '#fefce8' }}>⚡</div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Business Automation</h3>
                <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Repetitive kaam ko automate karein — emails, invoices, follow-ups sab automatic.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: '5rem 0', background: '#f9fafb', borderTop: '1px solid #f0f0f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Kaise Kaam Hota Hai?</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>Sirf 3 simple steps mein shuru karein</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.2rem', fontWeight: 700 }}>1</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Baat Karein</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Form bharein ya call karein, hum sunenge aapki zarurat.</p>
            </div>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.2rem', fontWeight: 700 }}>2</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Plan Banayein</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Hum aapke liye ek custom plan tayaar karenge.</p>
            </div>
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', fontSize: '1.2rem', fontWeight: 700 }}>3</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>Launch Karein</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Hum build karenge aur aapka project live kar denge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO ─── */}
      <section id="work" style={{ padding: '5rem 0', background: '#fff', borderTop: '1px solid #f0f0f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Humare Projects</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>Yeh kuch projects hain jo humne apne clients ke liye banaye hain</p>
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
              <p style={{ fontSize: '1rem', color: '#555', marginBottom: '0.25rem' }}>Abhi koi project add nahi hua hai</p>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>Admin panel mein jaakar projects add karein</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CONTACT FORM ─── */}
      <section id="contact" style={{ padding: '5rem 0', background: '#f9fafb', borderTop: '1px solid #f0f0f0' }}>
        <div className="container" style={{ maxWidth: '550px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Free Consultation Book Karein</h2>
            <p className="text-muted" style={{ fontSize: '1rem' }}>Neeche form bharein, hum 24 ghante ke andar aapko contact karenge.</p>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <input type="text" className="form-input" placeholder="Aapka Naam" />
            <input type="email" className="form-input" placeholder="Email Address" />
            <input type="tel" className="form-input" placeholder="Phone Number" />
            <select className="form-input" style={{ color: '#aaa' }}>
              <option value="">Kya Service Chahiye?</option>
              <option value="website">Website Development</option>
              <option value="chatbot">AI Chatbot</option>
              <option value="automation">Business Automation</option>
              <option value="other">Other</option>
            </select>
            <textarea className="form-input" rows={3} placeholder="Apne project ke baare mein batayein..." style={{ resize: 'vertical' }}></textarea>
            <button type="button" className="btn btn-blue" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              ✉️ Message Bhejein
            </button>
            <p className="text-muted" style={{ fontSize: '0.8rem', textAlign: 'center' }}>Bilkul free hai. Koi hidden charges nahi.</p>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ padding: '2rem 0', borderTop: '1px solid #eee', background: '#fff' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>© 2026 Anti Gravity 2.0</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="#services" style={{ fontSize: '0.85rem', color: '#999' }}>Services</Link>
            <Link href="#work" style={{ fontSize: '0.85rem', color: '#999' }}>Work</Link>
            <Link href="#contact" style={{ fontSize: '0.85rem', color: '#999' }}>Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
