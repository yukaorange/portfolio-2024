'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ButtonCategory } from '@/components/Common/ButtonCategory/ButtonCategory';
import { ContentRenderer } from '@/components/Common/ContentRenderer/ContentRenderer';
import { useFormattedDate } from '@/hooks/useFormattedData';
import { Content } from '@/lib/microcms';

import styles from './content.module.scss';

interface ArticleContentProps {
  content: Content;
}

export const ArticleContent = ({ content }: ArticleContentProps) => {
  const router = useRouter();
  const formattedDates = useFormattedDate(content.createdAt);

  const {
    // thumbnail: { url, width, height },
    category,
    images,
    href,
  } = content;

  const handeRouterBack = () => {
    router.back();
  };

  return (
    <div className={styles.content}>
      <div className={styles.content__metaArea}>
        <div className={styles.content__meta}>
          <span className={styles.content__meta__heading}>作成日：</span>
          <div className={styles.content__date}>{formattedDates}</div>
        </div>
        <div className={styles.content__meta}>
          <span className={styles.content__meta__heading}>カテゴリー：</span>
          <ul className={styles.content__categories}>
            {category
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((item, categoryKey) => {
                return (
                  <li key={categoryKey} className={`${styles.content__category} _en`}>
                    <ButtonCategory href={`/gallery/category/${item.id}/p/1`}>
                      {item.name}
                    </ButtonCategory>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
      <div className={styles.content__textbox}>
        <p className={styles.content__text}>
          <ContentRenderer content={content.content} />
        </p>
      </div>
      {href && (
        <Link href={href} target="_blank">
          <div className={styles.content__deploy}>
            <span className={styles.content__deploy__heading}>公開中:</span>
            <div className={styles.content__deploy__link}>{href}</div>
          </div>
        </Link>
      )}
      <button onClick={handeRouterBack} className={`${styles.content__back} _en`}>
        back
      </button>
      <div className={styles.content__images}>
        {images.map((image, index) => {
          return (
            <div key={index} className={styles.content__image}>
              <Image
                src={image.url}
                alt="コンテンツの詳細画像"
                width={image.width}
                height={image.height}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
