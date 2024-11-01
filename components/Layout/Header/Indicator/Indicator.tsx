'use client';

import styles from '@/components/Layout/Header/Indicator/indicator.module.scss';

export const Indicator = () => {
  return (
    <div className={styles.indicator}>
      <div className={styles.indicator__inner}>
        <div className={styles.indicator__icon}>
          <Earth />
        </div>
        <div className={`${styles.indicator__content} _en`}>
          <span className={styles.indicator__text}>Portfolio</span>
        </div>
      </div>
    </div>
  );
};

interface EarthProps {
  width?: string;
  height?: string;
}

const Earth = ({ width = '214', height = '215' }: EarthProps) => {
  return (
    <svg
      id="earth"
      data-name="earth"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 214.17 215.28"
      width={width}
      height={height}
    >
      <g id="earth" data-name="earth">
        <g>
          <ellipse
            cx="107.08"
            cy="107.64"
            rx="106.58"
            ry="107.14"
            fill="none"
            stroke="#f1f1f1"
            strokeMiterlimit="10"
            strokeWidth={2}
            className={styles.indicator__ellipse__ellipse00}
          />
          <ellipse
            cx="107.08"
            cy="107.64"
            rx="106.58"
            ry="107.14"
            fill="none"
            stroke="#f1f1f1"
            strokeMiterlimit="10"
            strokeWidth={2}
            className={styles.indicator__ellipse__ellipse01}
          />
          <ellipse
            cx="107.08"
            cy="107.64"
            rx="66.62"
            ry="107.14"
            fill="none"
            stroke="#f1f1f1"
            strokeMiterlimit="10"
            strokeWidth={2}
            className={styles.indicator__ellipse__ellipse02}
          />
          <ellipse
            cx="107.08"
            cy="107.64"
            rx="93.26"
            ry="107.14"
            fill="none"
            stroke="#f1f1f1"
            strokeMiterlimit="10"
            strokeWidth={2}
            className={styles.indicator__ellipse__ellipse03}
          />
          <ellipse
            cx="107.08"
            cy="107.64"
            rx="26.65"
            ry="107.14"
            fill="none"
            stroke="#f1f1f1"
            strokeMiterlimit="10"
            strokeWidth={2}
            className={styles.indicator__ellipse__ellipse04}
          />
          <path
            d="M186.66,179.07c16.79-18.93,27-43.89,27-71.24s-10.22-52.31-27-71.24c-22.21,11.1-49.75,17.67-79.58,17.67s-57.37-6.57-79.58-17.67C10.72,55.51.5,80.46.5,107.82s10.22,52.31,27,71.24c22.21-11.1,49.75-17.67,79.58-17.67s57.37,6.57,79.58,17.67Z"
            fill="none"
            stroke="#f1f1f1"
            strokeMiterlimit="10"
            strokeWidth={2}
          />
        </g>
        <line
          x1="0.5"
          y1="107.82"
          x2="213.67"
          y2="107.82"
          fill="none"
          stroke="#f1f1f1"
          strokeMiterlimit="10"
          strokeWidth={2}
        />
      </g>
    </svg>
  );
};
