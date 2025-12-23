import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="auth-container">
      <main className="position-relative" style={{ zIndex: 1 }}>
        {children}
      </main>
    </section>
  );
}
