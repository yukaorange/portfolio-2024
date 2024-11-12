'use client';

import styles from '@/components/Layout/Header/header.module.scss';
import { Indicator } from '@/components/Layout/Header/Indicator/Indicator';
import { TransitionLink } from '@/components/Common/TransitionLink.tsx/TransitionLink';
import { useRecoilState } from 'recoil';
import { toggleMenuOpen } from '@/store/toggleMenuAtom';

export const Header = () => {
  const [isOpen, setIsOpen] = useRecoilState(toggleMenuOpen);
  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <header className={styles.header} data-ui="header">
      <div className={styles.header__inner}>
        <TransitionLink
          onClose={handleClick}
          href="/"
          scroll={false}
          className={styles.header__logo}
        >
          <Indicator />
        </TransitionLink>
      </div>
    </header>
  );
};
