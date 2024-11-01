'use client';

import { useCallback, useEffect, useRef } from 'react';

import { CanvasGallery } from '@/components/Top/TopGallery/CanvasGallery/CanvasGallery';
import { DrumRoll } from '@/components/Top/TopGallery/DrumRoll/DrumRoll';
import styles from '@/components/Top/TopGallery/gallery.module.scss';

export const Topgallery = () => {
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollPosition = window.scrollY;

    const scrollPosition = Math.max(0, currentScrollPosition - window.innerHeight);

    const pageHeight = document.documentElement.scrollHeight - window.innerHeight * 2;

    const rawProgress = Math.min(Math.max((scrollPosition / pageHeight) * 4, 0), 4);

    targetProgressRef.current = rawProgress;
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const animateProgress = () => {
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.1;
      requestAnimationFrame(animateProgress);
    };

    const animationId = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className={styles.gallery}>
      <div className={styles.gallery__inner}>
        <div className={styles.gallery__drumroll}>
          <DrumRoll currentProgressRef={currentProgressRef} targetProgressRef={targetProgressRef} />
        </div>
        <div className={styles.gallery__canvas}>
          <CanvasGallery
            currentProgressRef={currentProgressRef}
            targetProgressRef={targetProgressRef}
          />
        </div>
      </div>
    </section>
  );
};
