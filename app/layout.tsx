import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Leadership ToDo',
  description: 'Position2 leadership task tracker — iOS-native styled, fast and focused.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Leadership ToDo',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F2F7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
