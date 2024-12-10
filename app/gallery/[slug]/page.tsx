import { ClientWrapper } from '@/app/ClientWrapper';
import { ArticleContent } from '@/components/Article/ArticleContent/ArticleContent';
import { ArticlePageview } from '@/components/Article/ArticlePageview/ArticlePageview';
import { GalleryLayout } from '@/components/Gallery/GalleryLayout/GalleryLayout';
import { getWorksDetail, getWorksContents, Content } from '@/lib/microcms';

import styles from './article.module.scss';

interface ArticleProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const { contents } = await getWorksContents({ offset: 0, limit: 100 });
  return contents.map((content: Content) => ({
    slug: content.id,
  }));
}

export default async function Article({ params }: ArticleProps) {
  const { slug } = params;

  const data = await getWorksDetail(slug);

  return (
    <ClientWrapper galleryContents={data}>
      <div className={styles.article}>
        {/* fv */}
        <ArticlePageview title={data.title} description={data.description} />
        {/* content */}
        <GalleryLayout content={<ArticleContent content={data} />} />
      </div>
    </ClientWrapper>
  );
}
