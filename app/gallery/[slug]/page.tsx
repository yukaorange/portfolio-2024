import { ClientWrapper } from '@/app/ClientWrapper';
import { ArticleContent } from '@/components/Article/ArticleContent/ArticleContent';
import { ArticlePageview } from '@/components/Article/ArticlePageview/ArticlePageview';
import { GalleryLayout } from '@/components/Gallery/GalleryLayout/GalleryLayout';
import { getWorksDetail } from '@/lib/microcms';

import styles from './article.module.scss';

interface ArticleProps {
  params: { slug: string };
}

export default async function article({ params }: ArticleProps) {
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
