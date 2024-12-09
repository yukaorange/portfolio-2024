import Image from 'next/image';

import { TransitionLink } from '@/components/Common/TransitionLink/TransitionLink';
import styles from '@/components/Top/TopWorks/Archive/archive.module.scss';

export const Archive = () => {
  const archive = [
    {
      title: 'Projects',
      description: '制作したWebサイト',
      amount: '02',
      available: false,
      href: '/',
    },
    {
      title: 'App',
      description: '個人制作Webアプリケーション',
      amount: '01',
      available: true,
      href: 'colortrainingapp',
    },
    {
      title: 'Modeling',
      description: '個人制作3Dモデル',
      amount: '01',
      available: true,
      href: 'character',
    },
  ];

  return (
    <div className={styles.archive}>
      {archive.map((item, index) => {
        return (
          <TransitionLink
            href={item.available ? `/gallery/${item.href}` : '/'}
            className={`${styles.item} ${item.available == false && styles.unavailable}`}
            key={index}
          >
            <div className={styles.item__inner}>
              <div className={styles.item__header}>
                <div className={styles.item__heading}>
                  <h3 className={`${styles.item__title} _helvetica`}>{item.title}</h3>
                  <div className={styles.item__icon}>
                    <Arrow />
                  </div>
                </div>
                <div className={styles.item__description}>{item.description}</div>
              </div>
              <div className={`${styles.item__amount} _en`}>{item.amount}</div>
            </div>
            <div className={styles.item__bg}>
              <ItemBg />
            </div>
            {!item.available && (
              <div className={styles.item__warning}>
                <Image src="/images/top/keepout.svg" alt="warning" width={1032} height={73} />
              </div>
            )}
          </TransitionLink>
        );
      })}
    </div>
  );
};

interface ArrowProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}
const Arrow = ({ width = 40, height = 41, color = '#151515', className = '' }: ArrowProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 40 41"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g clipPath="url(#clip0_345_187)">
        <path
          d="M8.74731 2.47461H37.9435V31.6708"
          stroke={color}
          strokeWidth="5.67"
          strokeMiterlimit="10"
        />
        <path
          d="M37.9435 2.47461L1.44824 38.9699"
          stroke={color}
          strokeWidth="5.67"
          strokeMiterlimit="10"
        />
      </g>
      <defs>
        <clipPath id="clip0_345_187">
          <rect width="40" height="40" fill="white" transform="translate(0 0.425293)" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface ItemBgProps {
  width?: number;
  height?: number;
  className?: string;
}
const ItemBg = ({ width = 719, height = 176, className = '' }: ItemBgProps = {}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 719 176"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M53.8318 175.379H720V121.547V0.425293H0.373832L0 121.547L53.8318 175.379Z"
        fill="#F1F1F1"
      />
    </svg>
  );
};
