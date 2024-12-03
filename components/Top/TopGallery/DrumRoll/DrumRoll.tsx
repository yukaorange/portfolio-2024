import Link from 'next/link';
import { useRef, useEffect, useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

import styles from '@/components/Top/TopGallery/DrumRoll/drumroll.module.scss';
import { galleryRoundedIndex } from '@/store/galleryProgressAtom';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

interface DrumRollProps {
  targetProgressRef: React.MutableRefObject<number>;
  currentProgressRef: React.MutableRefObject<number>;
}

export const DrumRoll = ({ targetProgressRef, currentProgressRef }: DrumRollProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);
  const indicatorRef = useRef<HTMLUListElement>(null);
  const [roundedIndex] = useRecoilState(galleryRoundedIndex);
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const setItemRef = useCallback((el: HTMLLIElement | null, index: number) => {
    itemRefs.current[index] = el as HTMLLIElement;
  }, []);

  // const animateProgress = useCallback(
  //   (currentTime: number) => {
  //     if (!isComponentMounted) {
  //       console.log('unmount DrumRoll', currentTime, targetProgressRef);
  //       return;
  //     }

  //     listRef.current?.style.setProperty(
  //       '--drumroll-progress',
  //       currentProgressRef.current.toString()
  //     );

  //     itemRefs.current.forEach((item, index) => {
  //       let distance = Math.abs(index - currentProgressRef.current) / (itemRefs.current.length - 1);

  //       distance = distance * 2.5;

  //       if (item) {
  //         item.style.setProperty(`--drumroll-each-progress`, distance.toString());
  //       }
  //     });
  //   },
  //   [currentProgressRef, isComponentMounted, itemRefs, listRef, targetProgressRef]
  // );

  const animateProgress = useCallback(
    (currentTime: number) => {
      if (!isComponentMounted) {
        console.log('unmount DrumRoll', currentTime, targetProgressRef);
        return;
      }

      // メインリストの進行状態更新
      const progress = currentProgressRef.current;
      listRef.current?.style.setProperty('--drumroll-progress', progress.toString());

      // パフォーマンス最適化
      const totalItems = itemRefs.current.length - 1;
      const multiplier = 2.5;

      // Transform処理をバッチ化
      requestAnimationFrame(() => {
        itemRefs.current.forEach((item, index) => {
          if (item) {
            const distance = (Math.abs(index - progress) / totalItems) * multiplier;
            item.style.setProperty(`--drumroll-each-progress`, distance.toString());
          }
        });
      });
    },
    [currentProgressRef, isComponentMounted, itemRefs, listRef, targetProgressRef]
  );

  useEffect(() => {
    setIsComponentMounted(true);

    return () => {
      // console.log('unmount DrumRoll');
      setIsComponentMounted(false);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    if (isComponentMounted) {
      // console.log(isComponentMounted);
      const animate = (currentTime: number) => {
        animateProgress(currentTime);

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animateProgress, isComponentMounted]);

  const archive = [
    {
      title: 'Globe Phenomenon',
      url: 'https://point-of-globe-environment.vercel.app/',
      description: 'NASAのAPIを使用した自然現象マップ',
    },
    {
      title: 'Infinite Scroll Gallery',
      url: 'https://design-embraced-challenge.vercel.app/',
      description: '円形を描く無限スクロールギャラリー',
    },
    {
      title: 'Glitch Theater',
      url: 'https://glitch-theater-challenge.vercel.app/',
      description: '3Dモデルでグリッチ演出を一覧化したもの',
    },
    {
      title: 'Scan Ripple ASCII',
      url: 'https://scan-ripple-ascii.vercel.app/',
      description: '視覚エフェクトを統合したもの',
    },
    {
      title: 'Distortion Scroll',
      url: 'https://webgl-school-project07.vercel.app/',
      description: 'スクロールに連動した歪みエフェクト',
    },
  ];

  useEffect(() => {
    // console.log(roundedIndex);

    itemRefs.current.forEach((item, index) => {
      if (item) {
        if (index === roundedIndex) {
          item.classList.add(styles.current);
        } else {
          item.classList.remove(styles.current);
        }
      }
    });
  }, [roundedIndex]);

  return (
    <>
      <div className={styles.drumroll}>
        <ul ref={listRef} className={styles.drumroll__list}>
          {archive.map((item, id) => {
            return (
              <li
                key={`${id}-${roundedIndex}`}
                ref={(el) => setItemRef(el, id)}
                className={`${styles.drumroll__list__item} ${id === roundedIndex ? styles.current : ''} _en`}
              >
                <Link href={item.url} target="_blank">
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div
        className={styles.drumroll__indicator}
        style={{
          '--drumroll-indicator-progress': roundedIndex,
        }}
      >
        <ul ref={indicatorRef} className={styles.drumroll__indicator__list}>
          {archive.map((item, id) => {
            return (
              <li
                key={id}
                className={`${styles.drumroll__indicatorlist__item} ${id === roundedIndex ? styles.current : ''}`}
              >
                {item.description}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
