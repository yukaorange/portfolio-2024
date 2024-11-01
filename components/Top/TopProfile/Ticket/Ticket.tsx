'use client';

import { useEffect, useRef, useState } from 'react';

import { ResponsiveImage } from '@/components/Common/ResponsiveImage/ResponsiveImage';
import styles from '@/components/Top/TopProfile/Ticket/ticket.module.scss';

export const Ticket = () => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ticketRef.current) {
        const rect = ticketRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const ratio = (viewportHeight - rect.top) / viewportHeight;

        const clampedRatio = Math.max(0, Math.min(1, ratio));

        setScrollRatio(clampedRatio);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={ticketRef}
        className={styles.ticket}
        id="ticket"
        style={{ '--scroll-ratio': scrollRatio } as React.CSSProperties}
      >
        <ResponsiveImage
          className={styles.ticket__image}
          imageSrcPC="/images/top/ticket.png"
          widthPc={2709}
          heightPc={1053}
          imageSrcSp="/images/top/ticket--sp.png"
          widthSp={1932}
          heightSp={1053}
          altText="これはプロフィールページへのリンクボタンの役割を持つ画像です。"
        />
        <div className={styles.ticket__arrows}>
          <Arrows />
        </div>
        <div className={styles.ticket__bg}>
          <div className={styles.ticket__bg__image}></div>
        </div>
      </div>
      <div className={styles.ticket__mask}>
        <svg width="0" height="0">
          <defs>
            <clipPath id="svgClip" clipPathUnits="objectBoundingBox">
              <path d="M0.9841 0 L0.7127 0 L0.016 0 L0 0.0411 L0 0.9589 L0.016 1 L0.7127 1 L0.9841 1 L1 0.9589 L1 0.0411 L0.9841 0" />
            </clipPath>
            <clipPath id="svgClip2" clipPathUnits="objectBoundingBox">
              <path d="M0.98 0 L0.72 0 L0.025 0 L0 0.05 L0 0.96 L0.02 1 L0.72 1 L0.98 1 L1 0.96 L1 0.045 L0.975 0" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </>
  );
};

interface ArrowProps {
  width?: number;
  height?: number;
  className?: string;
}
const Arrows = ({ width = 654.97, height = 232.59, className = '' }: ArrowProps) => {
  return (
    <svg
      id="arrows"
      data-name="arrows"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 654.97 232.59"
      width={width}
      height={height}
      className={className}
    >
      <defs>
        <style>
          {`
          .arrow {
            fill: none;
            stroke: #c9ff36;
            stroke-miterlimit: 10;
            stroke-width: 5.67px;
          }
        `}
        </style>
      </defs>
      <g id="ticket">
        <g id="arrows">
          <polygon
            className="arrow"
            points="14.18 2.83 2.83 14.18 2.83 25.53 70.91 116.3 2.83 207.07 2.83 218.41 14.18 229.76 110.62 229.76 190.05 121.97 190.05 110.62 110.62 2.83 14.18 2.83"
          />
          <polygon
            className="arrow"
            points="245.88 2.83 234.53 14.18 234.53 25.53 302.61 116.3 234.53 207.07 234.53 218.41 245.88 229.76 342.32 229.76 421.75 121.97 421.75 110.62 342.32 2.83 245.88 2.83"
          />
          <polygon
            className="arrow"
            points="476.27 2.83 464.92 14.18 464.92 25.53 533 116.3 464.92 207.07 464.92 218.41 476.27 229.76 572.71 229.76 652.13 121.97 652.13 110.62 572.71 2.83 476.27 2.83"
          />
        </g>
      </g>
    </svg>
  );
};
