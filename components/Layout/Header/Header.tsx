'use client';

import Link from 'next/link';
// import Image from 'next/image';

import styles from '@/components/Layout/Header/header.module.scss';
import { Indicator } from '@/components/Layout/Header/Indicator/Indicator';
// import { useState, useCallback, useEffect } from 'react';

export const Header = () => {
  return (
    <header className={styles.header} data-ui="header">
      <div className={styles.header__inner}>
        <Link href="/" className={styles.header__logo}>
          <Indicator />
        </Link>
      </div>
    </header>
  );
};
