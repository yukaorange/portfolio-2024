import Image from 'next/image';

import styles from './button.module.scss';
import { TransitionLink } from '../TransitionLink.tsx/TransitionLink';

interface ButtonLinkProps {
  href: string;
  text: string;
}

export const ButtonLink = ({ href, text }: ButtonLinkProps) => {
  return (
    <TransitionLink href={href} className={styles.button}>
      <span className={`${styles.button__text} _en`}>{text}</span>
      <div className={styles.button__frames}>
        <div className={`${styles.button__frame__upperLeft} ${styles.button__frame}`}>
          <Image src="/images/top/frame-up-left.svg" width={35} height={32} alt="" />
        </div>
        <div className={`${styles.button__frame__upperRight} ${styles.button__frame}`}>
          <Image src="/images/top/frame-up-right.svg" width={35} height={32} alt="" />
        </div>
        <div className={`${styles.button__frame__lowerLeft} ${styles.button__frame}`}>
          <Image src="/images/top/frame-lower-left.svg" width={35} height={32} alt="" />
        </div>
        <div className={`${styles.button__frame__lowerRight} ${styles.button__frame}`}>
          <Image src="/images/top/frame-lower-right.svg" width={35} height={32} alt="" />
        </div>
      </div>
    </TransitionLink>
  );
};
