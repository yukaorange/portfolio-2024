import { ClientWrapper } from '@/app/ClientWrapper';
import { GalleryLayout } from '@/components/Gallery/GalleryLayout/GalleryLayout';
import { GalleryList } from '@/components/Gallery/GalleryList/GalleryList';
import { GalleryNav } from '@/components/Gallery/GalleryNav/GalleryNav';
import { GalleryPageview } from '@/components/Gallery/GalleryPageview/GalleryPageview';
import { getWorksContents, getWorksCategories, GALLERY_LIST_LIMIT } from '@/lib/microcms';

import styles from './gallery.module.scss';

interface GalleryProps {
  params: { current: number };
}

export default async function gallery({ params }: GalleryProps) {
  const { current } = params;
  const offset = (Number(current) - 1) * GALLERY_LIST_LIMIT;

  const { contents, totalCount } = await getWorksContents({
    limit: GALLERY_LIST_LIMIT,
    offset: offset,
  });

  const categories = await getWorksCategories();

  return (
    <>
      <ClientWrapper galleryContents={contents}>
        <div className={styles.gallery}>
          {/* fv */}
          <GalleryPageview
            heading="gallery"
            lead="制作したコードやグラフィックを掲載しています。"
          />
          {/* content */}
          <GalleryLayout
            content={<GalleryList contents={contents} current={current} totalCount={totalCount} />}
            nav={<GalleryNav categories={categories} />}
          />
        </div>
      </ClientWrapper>
    </>
  );
}
