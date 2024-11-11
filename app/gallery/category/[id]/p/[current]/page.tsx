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
  params: { id: string; current: number };
}

export default async function gallery({ params }: CategoryProps) {
  const { current } = params;
  const offset = (Number(current) - 1) * GALLERY_LIST_LIMIT;

  const categories = await getWorksCategories();

  const currentCategory = categories.find((category: Category) => category.id === params.id);

  const { contents, totalCount } = await getWorksContentsByCategory({
    limit: GALLERY_LIST_LIMIT,
    offset: offset,
    categoryId: params.id,
  });

  return (
    <div className={styles.category}>
      {/* fv */}
      <GalleryPageview heading="filtered by category" lead={`表示中:${currentCategory.name}`} />
      {/* content */}
      <GalleryLayout
        content={
          <GalleryList
            contents={contents}
            current={current}
            totalCount={totalCount}
            pagepath={`/gallery/category/${params.id}/p`}
          />
        }
        nav={<GalleryNav categories={categories} />}
      />
    </div>
  );
}
