import Link from 'next/link';
import React from 'react';

import styles from './cta.module.scss';

export const CTAButton = () => {
  return (
    <Link className={`${styles.cta} _en`} target="_blank" href="https://x.com/webcreaterfrm30">
      contact
    </Link>
  );
};
