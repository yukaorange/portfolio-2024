import Link from 'next/link';

import { GALLERY_LIST_LIMIT } from '@/lib/microcms';

import styles from './pagination.module.scss';

interface PaginationProps {
  totalCount: number;
  current: number;
  pagepath?: string;
}

export const Pagination = ({ totalCount, current, pagepath = '/gallery/p' }: PaginationProps) => {
  const pages = Array.from(
    { length: Math.ceil(totalCount / GALLERY_LIST_LIMIT) },
    (_, index) => index + 1
  );

  return (
    <div className={styles.pagination}>
      {pages.map((page, index) => {
        return (
          <Link
            href={`${pagepath}/${page}`}
            key={index}
            className={
              page == current
                ? `${styles.pagination__item} ${styles.current}`
                : styles.pagination__item
            }
          >
            {page}
          </Link>
        );
      })}
    </div>
  );
};
