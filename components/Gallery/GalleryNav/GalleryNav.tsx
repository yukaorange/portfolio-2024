import { ButtonCategory } from '@/components/Common/ButtonCategory/ButtonCategory';
import { Category } from '@/lib/microcms';

import styles from './nav.module.scss';

interface GalleryNavProps {
  categories: Category[];
}

export const GalleryNav = ({ categories }: GalleryNavProps) => {
  return (
    <>
      <nav className={styles.nav}>
        <h2 className={styles.title}>カテゴリーリスト</h2>
        <ul className={styles.list}>
          {categories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category, key) => {
              return (
                <li key={key} className={`${styles.item} _en`}>
                  <ButtonCategory href={`/gallery/category/${category.id}/p/1`}>
                    {category.name}
                  </ButtonCategory>
                </li>
              );
            })}
          <li className={`${styles.item} ${styles.item_all} _en`}>
            <ButtonCategory href={`/gallery/p/1`}>ALL</ButtonCategory>
          </li>
        </ul>
      </nav>
    </>
  );
};
