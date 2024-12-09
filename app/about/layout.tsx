import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'takaoka-portfolio2024 | エンジニアとしての私について',
  description:
    ' Webサイトの創造的な表現に魅力を感じ、興味を持ったことをきっかけにフロントエンドエンジニアリングの学習を始め、日々技術の向上に励んでいます。',
  openGraph: {
    title: 'takaoka-portfolio2024',
    description:
      ' Webサイトの創造的な表現に魅力を感じ、興味を持ったことをきっかけにフロントエンドエンジニアリングの学習を始め、日々技術の向上に励んでいます。',
    url: 'https://portfolio-2024-takaoka.vercel.app/',
    images: [
      {
        url: 'https://portfolio-2024-takaoka.vercel.app/ogp.jpg',
        alt: 'takaoka-portfolio2024',
      },
    ],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
