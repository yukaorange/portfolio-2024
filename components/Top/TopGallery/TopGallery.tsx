'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';

import { ButtonLink } from '@/components/Common/ButtonLink/ButtonLink';
import { CanvasGallery } from '@/components/Top/TopGallery/CanvasGallery/CanvasGallery';
import { DrumRoll } from '@/components/Top/TopGallery/DrumRoll/DrumRoll';
import styles from '@/components/Top/TopGallery/gallery.module.scss';
import { SpeedMeter } from '@/components/Top/TopGallery/SpeedMeter/SpeedMeter';
import { galleryRoundedIndex } from '@/store/galleryProgressAtom';

export const Topgallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef(0);
  const lastRoundedIndexRef = useRef<number>(0);
  const targetProgressRef = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const lastTouchY = useRef<number | null>(null);
  const touchVelocity = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const deltaTimeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const decayRate = 5;
  const maxVelocity = 1;
  const minVelocity = 0.001;

  const setRoundedIndex = useSetRecoilState(galleryRoundedIndex);

  const handleScroll = useCallback(() => {
    if (sectionRef.current === null) return;

    const sectionRect = sectionRef.current?.getBoundingClientRect();

    const sectionTop = sectionRect.top + window.scrollY || 0;

    if (window.scrollY < sectionTop) {
      targetProgressRef.current = 0;
      return;
    }

    const currentScrollPosition = window.scrollY;

    const scrollPosition = currentScrollPosition - sectionTop;
    const sectionHeight = sectionRect.height;
    const progressRange = sectionHeight - window.innerHeight;
    const rawProgress = Math.min(Math.max((scrollPosition / progressRange) * 4, 0), 4);

    targetProgressRef.current = rawProgress;
    const roundedIndex = Math.round(currentProgressRef.current);

    if (lastRoundedIndexRef.current !== roundedIndex) {
      setRoundedIndex(roundedIndex);
    }
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
  }, [setRoundedIndex]);

  const handleWheel = useCallback((event: WheelEvent) => {
    const isTrackpad = event.deltaMode === 0 && Math.abs(event.deltaY) < 50;

    if (isTrackpad) {
      velocityRef.current += event.deltaY * 0.003;
    } else {
      velocityRef.current += event.deltaY * 0.0013;
    }
  }, []);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
    lastTouchY.current = event.touches[0].clientY;
    touchVelocity.current = 0;
  }, []);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (lastTouchY.current !== null) {
      const currentY = event.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY;
      touchVelocity.current = deltaY * 0.004;
      lastTouchY.current = currentY;

      velocityRef.current += touchVelocity.current;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchStartY.current = null;
    lastTouchY.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, handleWheel, handleTouchStart, handleTouchMove, handleTouchEnd]);

  useEffect(() => {
    const animate = (currentTime: number) => {
      // currentProgressの値を収束
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.1;

      // 速度の減衰を算出
      if (lastTimeRef.current !== 0) {
        deltaTimeRef.current = (currentTime - lastTimeRef.current) / 1000;
      } else {
        deltaTimeRef.current = 0;
      }
      lastTimeRef.current = currentTime;

      velocityRef.current += diff * 0.07;

      const decay = Math.exp(-decayRate * deltaTimeRef.current);
      velocityRef.current *= decay;

      if (Math.abs(velocityRef.current) < minVelocity) {
        velocityRef.current = 0;
      }

      velocityRef.current = Math.max(Math.min(velocityRef.current, maxVelocity), -maxVelocity);

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section ref={sectionRef} className={styles.gallery}>
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
          <SpeedMeter velocityRef={velocityRef} />
        </div>
        <div className={styles.gallery__link}>
          <ButtonLink href="/gallery/p/1" text="SEE ALL" />
        </div>
      </div>
    </section>
  );
};
