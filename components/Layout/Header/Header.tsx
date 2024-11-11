'use client';

import styles from '@/components/Layout/Header/header.module.scss';
import { Indicator } from '@/components/Layout/Header/Indicator/Indicator';
import { TransitionLink } from '@/components/Common/TransitionLink.tsx/TransitionLink';

export const Header = () => {
  return (
    <header className={styles.header} data-ui="header">
      <div className={styles.header__inner}>
        <TransitionLink href="/" scroll={false} className={styles.header__logo}>
          <Indicator />
        </TransitionLink>
      </div>
    </header>
  );
};
