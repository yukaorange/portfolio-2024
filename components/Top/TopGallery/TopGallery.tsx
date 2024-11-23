'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';

import { useScrollVelocity } from '@/app/ScrollVelocityProvider';
import { ButtonLink } from '@/components/Common/ButtonLink/ButtonLink';
import { CanvasGallery } from '@/components/Top/TopGallery/CanvasGallery/CanvasGallery';
import { DrumRoll } from '@/components/Top/TopGallery/DrumRoll/DrumRoll';
import styles from '@/components/Top/TopGallery/gallery.module.scss';
import { SpeedMeter } from '@/components/Top/TopGallery/SpeedMeter/SpeedMeter';
import { galleryRoundedIndex } from '@/store/galleryProgressAtom';

export const Topgallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lastRoundedIndexRef = useRef<number>(0);
  const { currentProgressRef, targetProgressRef, setTargetProgress } = useScrollVelocity();
  const setRoundedIndex = useSetRecoilState(galleryRoundedIndex);

  const handleScroll = useCallback(() => {
    if (sectionRef.current === null) return;

    const sectionRect = sectionRef.current?.getBoundingClientRect();

    const sectionTop = sectionRect.top + window.scrollY || 0;

    if (window.scrollY < sectionTop) {
      setTargetProgress(0);
      return;
    }

    const currentScrollPosition = window.scrollY;

    const scrollPosition = currentScrollPosition - sectionTop;

    const sectionHeight = sectionRect.height;

    const progressRange = sectionHeight - window.innerHeight;

    const rawProgress = Math.min(Math.max((scrollPosition / progressRange) * 4, 0), 4);

    setTargetProgress(rawProgress);

    let roundedIndex: number = 0;

    if (currentProgressRef.current) {
      roundedIndex = Math.round(currentProgressRef.current);
    }

    if (lastRoundedIndexRef.current !== roundedIndex) {
      setRoundedIndex(roundedIndex);
    }

    // console.log(lastRoundedIndexRef.current, roundedIndex);

    lastRoundedIndexRef.current = roundedIndex;

    // const destination = currentProgressRef.current > targetProgressRef.current ? -1 : 1;

    // console.log(
    //   'sectionTop',
    //   sectionTop,
    //   '\n',
    //   'currentScrollPosition',
    //   currentScrollPosition,
    //   '\n',
    //   'scrollPosition',
    //   scrollPosition,
    //   '\n',
    //   'sectionHeight',
    //   sectionHeight,
    //   '\n',
    //   'progressRange',
    //   progressRange,
    //   '\n',
    //   'rawProgress',
    //   rawProgress
    // );
  }, [setRoundedIndex, setTargetProgress, currentProgressRef]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section id="top-gallery" ref={sectionRef} className={styles.gallery}>
      <div className={styles.gallery__inner}>
        <div className={styles.gallery__drumroll}>
          <DrumRoll currentProgressRef={currentProgressRef} targetProgressRef={targetProgressRef} />
        </div>
        <div className={styles.gallery__canvas}>
          {/* canvas2Dのrafのためにrefを渡す */}
          <CanvasGallery
            currentProgressRef={currentProgressRef}
            targetProgressRef={targetProgressRef}
          />
        </div>
        <div className={styles.gallery__speedmeter}>
          <SpeedMeter />
        </div>
        <div className={styles.gallery__link}>
          <ButtonLink href="/gallery/p/1" text="SEE ALL" />
        </div>
      </div>
    </section>
  );
};
