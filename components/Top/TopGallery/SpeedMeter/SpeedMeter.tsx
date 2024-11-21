import { useCallback, useEffect, useRef } from 'react';

import { useScrollVelocity } from '@/app/ScrollVelocityProvider';
import styles from '@/components/Top/TopGallery/SpeedMeter/speedmeter.module.scss';

interface SpeedMeterProps {
  width?: number;
  height?: number;
}

export const SpeedMeter = ({ width = 83, height = 57 }: SpeedMeterProps) => {
  const speedmeterRef = useRef<SVGSVGElement>(null);

  const { velocityRef } = useScrollVelocity();

  const animateVelocity = useCallback(() => {
    let velocity = 0;

    if (velocityRef.current) {
      velocity = Math.abs(velocityRef.current);
    }

    speedmeterRef.current?.style.setProperty('--velocity', velocity.toString());
    requestAnimationFrame(animateVelocity);
  }, [velocityRef]);

  useEffect(() => {
    const animationId = requestAnimationFrame(animateVelocity);

    return () => cancelAnimationFrame(animationId);
  }, [animateVelocity]);

  return (
    <div className={styles.speedmeter}>
      <svg
        ref={speedmeterRef}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 83 57"
        fill="none"
      >
        <g clipPath="url(#clip0_55_2266)">
          <path
            d="M55.0697 56.7882C56.321 56.7882 57.3353 55.7835 57.3353 54.5442C57.3353 53.3049 56.321 52.3003 55.0697 52.3003C53.8185 52.3003 52.8042 53.3049 52.8042 54.5442C52.8042 55.7835 53.8185 56.7882 55.0697 56.7882Z"
            stroke="#F1F1F1"
            strokeWidth="0.99"
            strokeMiterlimit="10"
          />
          <path
            className={styles.speedmeter__needle}
            d="M55.0697 53.9307V54.5446V55.1585L5.62109 54.5149L55.0697 53.9307Z"
            fill="#F1F1F1"
            stroke="#F1F1F1"
            strokeWidth="0.99"
            strokeMiterlimit="10"
          />
          <path
            d="M1.12427 54.3075C1.24823 25.0772 25.1048 1.32117 54.6936 1.11371C64.7988 1.04174 74.2799 3.73022 82.3973 8.46364"
            stroke="white"
            strokeWidth="0.99"
            strokeMiterlimit="10"
          />
          <path d="M2.1202 54.3071H0" stroke="white" strokeWidth="0.99" strokeMiterlimit="10" />
          <path
            d="M9.33136 28.1126L7.49756 27.0669"
            stroke="white"
            strokeWidth="0.99"
            strokeMiterlimit="10"
          />
          <path
            d="M28.8024 9.00528L27.7466 7.18896"
            stroke="white"
            strokeWidth="0.99"
            strokeMiterlimit="10"
          />
          <path d="M55.3135 2.09998V0" stroke="white" strokeWidth="0.99" strokeMiterlimit="10" />
          <path
            d="M81.7561 9.24258L82.8162 7.42627"
            stroke="white"
            strokeWidth="0.99"
            strokeMiterlimit="10"
          />
        </g>
        <defs>
          <clipPath id="clip0_55_2266">
            <rect width="83" height="57" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
