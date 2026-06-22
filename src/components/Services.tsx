import React from 'react';

const services = [
  { id: 1, title: 'Custom Websites', desc: 'High-converting, visually stunning web experiences.' },
  { id: 2, title: 'AI Chatbots', desc: 'Intelligent conversational agents available 24/7.' },
  { id: 3, title: 'AI Agents', desc: 'Autonomous systems that perform complex business tasks.' },
  { id: 4, title: 'Workflow Automation', desc: 'Eliminate manual work with seamless integrations.' },
  { id: 5, title: 'CRM Development', desc: 'Custom tailored CRMs powered by predictive AI.' },
  { id: 6, title: 'Lead Generation', desc: 'Automated systems to capture and nurture leads.' },
  { id: 7, title: 'Appointment Booking', desc: 'Smart scheduling that prevents double bookings.' },
  { id: 8, title: 'Business Automation', desc: 'End-to-end automation of your operational processes.' },
  { id: 9, title: 'AI Integrations', desc: 'Connect OpenAI, Anthropic, and other models.' },
  { id: 10, title: 'SaaS Development', desc: 'Scalable cloud software architecture and development.' }
];

export default function Services() {
  return (
    <section id="services" className="section" style={{ position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our <span className="text-gradient">Services</span></h2>
          <p className="text-gray" style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
            We build cutting-edge solutions designed to scale your business and automate your growth.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          {services.map(service => (
            <div key={service.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '12px', 
                background: 'rgba(0, 229, 255, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-accent-blue)' }}></div>
              </div>
              <h3 style={{ fontSize: '1.4rem' }}>{service.title}</h3>
              <p className="text-gray" style={{ fontSize: '0.95rem' }}>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
