import '@/styles/style.scss';

import { LayoutClient } from './LayoutClient';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'portfolio2024',
  description: 'created by takaoka',
  icons: {
    icon: '/favicon/logo.svg',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#151515',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
