import { ClientWrapper } from '@/app/ClientWrapper';
import { GalleryLayout } from '@/components/Gallery/GalleryLayout/GalleryLayout';
import { GalleryList } from '@/components/Gallery/GalleryList/GalleryList';
import { GalleryNav } from '@/components/Gallery/GalleryNav/GalleryNav';
import { GalleryPageview } from '@/components/Gallery/GalleryPageview/GalleryPageview';
import {
  getWorksContentsByCategory,
  getWorksCategories,
  Category,
  GALLERY_LIST_LIMIT,
} from '@/lib/microcms';

import styles from './category.module.scss';

interface CategoryProps {
  params: { id: string; current: string };
}

export async function generateStaticParams() {
  const categories = await getWorksCategories();
  const paths = [];

  for (const category of categories) {
    const { totalCount } = await getWorksContentsByCategory({
      categoryId: category.id,
      limit: 1,
    });

    const pageCount = Math.ceil(totalCount / GALLERY_LIST_LIMIT);

    for (let i = 1; i <= pageCount; i++) {
      paths.push({ id: category.id, current: `p${i}` });
    }
  }

  return paths;
}

export default async function Gallery({ params }: CategoryProps) {
  const { current, id } = params;
  // const offset = (Number(current) - 1) * GALLERY_LIST_LIMIT;
  const offset = (Number(current.replace('p', '')) - 1) * GALLERY_LIST_LIMIT;

  const categories = await getWorksCategories();

  const currentCategory = categories.find((category: Category) => category.id === id);

  if (!currentCategory) {
    throw new Error(`Category with id ${id} not found`);
  }

  const { contents, totalCount } = await getWorksContentsByCategory({
    limit: GALLERY_LIST_LIMIT,
    offset: offset,
    categoryId: id,
  });

  return (
    <ClientWrapper galleryContents={contents}>
      <div className={styles.category}>
        {/* fv */}
        <GalleryPageview heading="Filtered by category" lead={`表示中:${currentCategory.name}`} />
        {/* content */}
        <GalleryLayout
          content={
            <GalleryList
              contents={contents}
              current={Number(current)}
              totalCount={totalCount}
              pagepath={`/gallery/category/${params.id}/p`}
            />
          }
          nav={<GalleryNav categories={categories} />}
        />
      </div>
    </ClientWrapper>
  );
}
