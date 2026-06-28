'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const currentLang = params.lang as string;
  const targetLang = currentLang === 'en' ? 'hi' : 'en';

  const toggleLanguage = () => {
    if (!pathname) return;
    
    // Replace the current language in the pathname with the target language
    // e.g. /en/about -> /hi/about
    const newPathname = pathname.replace(`/${currentLang}`, `/${targetLang}`);
    router.push(newPathname);
  };

  if (!currentLang) return null; // Don't show if we are on a route without lang (like /admin)

  return (
    <button 
      onClick={toggleLanguage}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.8rem',
        borderRadius: '50px',
        border: '1px solid #e5e5e5',
        background: '#fff',
        color: '#555',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
      onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
    >
      <span style={{ fontSize: '1rem' }}>🌐</span>
      {currentLang === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
}
