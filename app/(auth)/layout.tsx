import { ReactNode } from 'react';
import Script from 'next/script';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section
      className="auth-container"
      style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#0d1117' }}
    >
      <div
        id="particles-js"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
      />
      <Script src="/assets/js/particles-config.js" strategy="afterInteractive" />
      <main className="position-relative" style={{ zIndex: 1 }}>
        {children}
      </main>
    </section>
  );
}
