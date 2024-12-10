import { ClientWrapper } from '@/app/ClientWrapper';
import { GalleryLayout } from '@/components/Gallery/GalleryLayout/GalleryLayout';
import { GalleryList } from '@/components/Gallery/GalleryList/GalleryList';
import { GalleryNav } from '@/components/Gallery/GalleryNav/GalleryNav';
import { GalleryPageview } from '@/components/Gallery/GalleryPageview/GalleryPageview';
import { getWorksContents, getWorksCategories, GALLERY_LIST_LIMIT } from '@/lib/microcms';

import styles from './gallery.module.scss';

interface GalleryProps {
  params: { current: string };
}

export async function generateStaticParams() {
  const { totalCount } = await getWorksContents({ limit: 1 });
  const pageCount = Math.ceil(totalCount / GALLERY_LIST_LIMIT);

  return Array.from({ length: pageCount }, (_, i) => ({
    current: `p${i + 1}`,
  }));
}

export default async function Gallery({ params }: GalleryProps) {
  const { current } = params;
  const currentPage = Number(current.replace('p', ''));
  const offset = (Number(current) - 1) * GALLERY_LIST_LIMIT;

  const { contents, totalCount } = await getWorksContents({
    limit: GALLERY_LIST_LIMIT,
    offset: offset,
  });

  const categories = await getWorksCategories();

  return (
    <ClientWrapper galleryContents={contents}>
      <div className={styles.gallery}>
        {/* fv */}
        <GalleryPageview heading="gallery" lead="制作したコードやグラフィックを掲載しています。" />
        {/* content */}
        <GalleryLayout
          content={
            <GalleryList
              contents={contents}
              current={currentPage}
              totalCount={totalCount}
              pagepath="/gallery/p"
            />
          }
          nav={<GalleryNav categories={categories} />}
        />
      </div>
    </ClientWrapper>
  );
}
