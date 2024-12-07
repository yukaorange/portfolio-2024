import Image from 'next/image';
import Link from 'next/link';

import { ButtonCategory } from '@/components/Common/ButtonCategory/ButtonCategory';
import { TransitionLink } from '@/components/Common/TransitionLink/TransitionLink';
import { Pagination } from '@/components/Gallery/Pagination/Pagination';
import { useFormattedDate } from '@/hooks/useFormattedData';
import { Content } from '@/lib/microcms';

import styles from './list.module.scss';

interface GalleryListProps {
  contents: Content[];
  current: number;
  totalCount: number;
  pagepath?: string;
}

export const GalleryList = ({ contents, current, totalCount, pagepath }: GalleryListProps) => {
  const dates = contents.map((item) => item.publishedAt);
  const formattedDates = useFormattedDate(dates);

  return (
    <>
      <ul data-ui="archive" className={`${styles.list}`}>
        {contents.map((item, key) => {
          return item.newTab ? (
            <li key={key} className={`${styles.item} item-key--${key}`}>
              <Link
                href={item.newTab ? item.href : `/gallery/${item.id}`}
                target="_blank"
                className={styles.item__thumbnail}
              >
                <Image
                  src={item.thumbnail.url == '' ? '' : item.thumbnail.url}
                  alt={item.title}
                  width={108}
                  height={108}
                />
              </Link>
              <div className={styles.item__inner}>
                <div className={`${styles.item__meta} _en`}>
                  <span className={styles.item__date}>{formattedDates[key]}</span>
                  <div className={styles.item__categories}>
                    {item.category
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item, categoryKey) => {
                        return (
                          <ButtonCategory
                            href={`/gallery/category/${item.id}/p/1`}
                            key={categoryKey}
                          >
                            {item.name}
                          </ButtonCategory>
                        );
                      })}
                  </div>
                </div>
                <Link
                  target="_blank"
                  href={item.newTab ? item.href : `/gallery/${item.id}`}
                  className={styles.item__body}
                >
                  <h3 className={`${styles.item__title} _helvetica`}>{item.title}</h3>
                  <p className={styles.item__description}>{item.description}</p>
                </Link>
                <Link
                  href={item.newTab ? item.href : `/gallery/${item.id}`}
                  target="_blank"
                  className={styles.item__linkicon}
                >
                  {item.newTab ? <LinkIcon /> : null}
                </Link>
              </div>
              <div className={`${styles.item__bg} _en`}>
                <div className={styles.item__marquee}>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                </div>
              </div>
            </li>
          ) : (
            <li key={key} className={`${styles.item} item-key--${key}`}>
              <TransitionLink
                href={item.newTab ? item.href : `/gallery/${item.id}`}
                target={item.newTab ? '_blank' : ''}
                className={styles.item__thumbnail}
              >
                <Image
                  src={item.thumbnail.url == '' ? '' : item.thumbnail.url}
                  alt={item.title}
                  width={108}
                  height={108}
                />
              </TransitionLink>
              <div className={styles.item__inner}>
                <div className={`${styles.item__meta} _en`}>
                  <span className={styles.item__date}>{formattedDates[key]}</span>
                  <div className={styles.item__categories}>
                    {item.category
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item, categoryKey) => {
                        return (
                          <ButtonCategory
                            href={`/gallery/category/${item.id}/p/1`}
                            key={categoryKey}
                          >
                            {item.name}
                          </ButtonCategory>
                        );
                      })}
                  </div>
                </div>
                <TransitionLink
                  target={item.newTab ? '_blank' : ''}
                  href={item.newTab ? item.href : `/gallery/${item.id}`}
                  className={styles.item__body}
                >
                  <h3 className={`${styles.item__title} _helvetica`}>{item.title}</h3>
                  <p className={styles.item__description}>{item.description}</p>
                </TransitionLink>
                <TransitionLink
                  href={item.newTab ? item.href : `/gallery/${item.id}`}
                  target={item.newTab ? '_blank' : ''}
                  className={styles.item__linkicon}
                >
                  {item.newTab ? <LinkIcon /> : null}
                </TransitionLink>
              </div>
              <div className={`${styles.item__bg} _en`}>
                <div className={styles.item__marquee}>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                  <span className={styles.item__marquee__text}>{item.title}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.pagination}>
        <Pagination totalCount={totalCount} current={current} pagepath={pagepath} />
      </div>
    </>
  );
};

interface LinkIconProps {
  className?: string;
}
const LinkIcon = ({ className = '' }: LinkIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M24 8.00001V1.33514e-05M24 1.33514e-05H16M24 1.33514e-05L12 12M9.33333 0H6.4C4.15979 0 3.03968 1.58946e-07 2.18404 0.435973C1.43139 0.819467 0.819467 1.43139 0.435973 2.18404C1.58946e-07 3.03968 0 4.15979 0 6.4V17.6C0 19.8403 1.58946e-07 20.9603 0.435973 21.816C0.819467 22.5687 1.43139 23.1805 2.18404 23.564C3.03968 24 4.15979 24 6.4 24H17.6C19.8403 24 20.9603 24 21.816 23.564C22.5687 23.1805 23.1805 22.5687 23.564 21.816C24 20.9603 24 19.8403 24 17.6V14.6667"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
