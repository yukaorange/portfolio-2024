import Link from 'next/link';

import styles from './button.module.scss';
import { TransitionLink } from '../TransitionLink.tsx/TransitionLink';

interface ButtonCategoryProps {
  href: string;
  children: string;
}

export const ButtonCategory = ({ href, children }: ButtonCategoryProps) => {
  return (
    <TransitionLink className={styles.button} href={href}>
      {children}
    </TransitionLink>
  );
};
