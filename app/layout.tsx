import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Third — QR Business Card',
  description: 'A credit-card-size English–Thai digital business card for Third with a scannable QR code.',
  openGraph: {
    title: 'Third — QR Business Card',
    description: 'Credit-card-size bilingual English–Thai digital business card with QR code.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#f7f3ec',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
