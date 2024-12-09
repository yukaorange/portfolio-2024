import '@/styles/style.scss';

import { LayoutClient } from './LayoutClient';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'takaoka-portfolio2024',
  description:
    'Next.js, R3F, microCMSを使用したポートフォリオサイトです。転職活動で自身の技術レベルをアピールする目的で作成しました。',
  icons: {
    icon: '/images/icons/favicon.ico',
  },
  openGraph: {
    title: 'takaoka-portfolio2024',
    description:
      'Next.js, R3F, microCMSを使用したポートフォリオサイトです。転職活動で自身の技術レベルをアピールする目的で作成しました。',
    url: 'https://portfolio-2024-takaoka.vercel.app',
    siteName: 'takaoka-portfolio2024',
    images: [
      {
        url: 'https://portfolio-2024-takaoka.vercel.app/ogp.jpg',
        width: 800,
        height: 600,
        alt: 'takaoka-portfolio2024',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'takaoka-portfolio2024',
    description:
      'Next.js, R3F, microCMSを使用したポートフォリオサイトです。転職活動で自身の技術レベルをアピールする目的で作成しました。',
    images: ['https://portfolio-2024-takaoka.vercel.app/ogp.jpg'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#151515',
  viewportFit: 'cover',
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
