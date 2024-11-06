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
  const animationRef = useRef<number>();
  const indicatorRef = useRef<HTMLUListElement>(null);
  const [roundedIndex] = useRecoilState(galleryRoundedIndex);
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  const setItemRef = useCallback((el: HTMLLIElement | null, index: number) => {
    itemRefs.current[index] = el as HTMLLIElement;
  }, []);

  const animateProgress = useCallback(() => {
    if (!isComponentMounted) return;

    listRef.current?.style.setProperty(
      '--drumroll-progress',
      currentProgressRef.current.toString()
    );

    itemRefs.current.forEach((item, index) => {
      let distance = Math.abs(index - currentProgressRef.current) / (itemRefs.current.length - 1);

      // if (index == 0) {
      //   console.log(
      //     distance,
      //     index,
      //     currentProgressRef.current,
      //     itemRefs.current.length - 1,
      //     Math.abs(index - currentProgressRef.current),
      //     Math.abs(index - currentProgressRef.current) / (itemRefs.current.length - 1)
      //   );
      // }

      distance = distance * 2.5;

      if (item) {
        item.style.setProperty(`--drumroll-each-progress`, distance.toString());
      }
    });

    if (isComponentMounted) {
      animationRef.current = requestAnimationFrame(animateProgress);
    }
  }, [currentProgressRef, isComponentMounted]);

  useEffect(() => {
    setIsComponentMounted(true);
    animateProgress();

    return () => {
      console.log('unmount DrumRoll');

      setIsComponentMounted(false);
      if (animationRef.current) {
        console.log('stop animation in DrumRoll');

        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animateProgress, currentProgressRef, isComponentMounted, targetProgressRef]);

  const archive = [
    {
      title: 'Globe Phenomenon',
      url: '/',
      description: 'NASAのAPIを使用した自然現象マップ',
    },
    {
      title: 'Infinite Scroll Gallery',
      url: '/',
      description: '円形を描く無限スクロールギャラリー',
    },
    {
      title: 'Glitch Theater',
      url: '/',
      description: '3Dモデルでグリッチ演出を一覧化したもの',
    },
    {
      title: 'Scan Ripple ASCII',
      url: '/',
      description: '視覚エフェクトを統合したもの',
    },
    {
      title: 'Distortion Scroll',
      url: '/',
      description: 'スクロールに連動した歪みエフェクト',
    },
  ];

  return (
    <>
      <div className={styles.drumroll}>
        <ul ref={listRef} className={styles.drumroll__list}>
          {archive.map((item, id) => {
            return (
              <li
                key={id}
                ref={(el) => setItemRef(el, id)}
                className={`${styles.drumroll__list__item} ${id === roundedIndex ? styles.current : ''} _en`}
              >
                {item.title}
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
