import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Cron Labs',
  description: 'Created by Michael Antoni',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Fonts and Icons */}
        <link
          href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800"
          rel="stylesheet"
        />
        <link href="https://use.fontawesome.com/releases/v5.0.6/css/all.css" rel="stylesheet" />

        {/* Black Dashboard CSS */}
        <link href="/assets/css/black-dashboard.css?v=1.0.0" rel="stylesheet" />
      </head>
      <body>
        {children}

        {/* Core JS Files */}
        <Script src="/assets/js/core/jquery.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/core/popper.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/core/bootstrap.min.js" strategy="beforeInteractive" />

        {/* Plugins */}
        <Script
          src="/assets/js/plugins/perfect-scrollbar.jquery.min.js"
          strategy="afterInteractive"
        />
        <Script src="/assets/js/plugins/chartjs.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/plugins/bootstrap-notify.js" strategy="afterInteractive" />

        {/* Google Maps (optional) */}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE"
          strategy="afterInteractive"
        />

        {/* Black Dashboard Core JS */}
        <Script src="/assets/js/black-dashboard.js?v=1.0.0" strategy="afterInteractive" />
      </body>
    </html>
  );
}
