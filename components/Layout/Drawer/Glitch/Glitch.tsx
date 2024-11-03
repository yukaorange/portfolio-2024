import { useRecoilValue } from 'recoil';

import { toggleMenuOpen } from '@/store/toggleMenuAtom';

import styles from './glitch.module.scss';

interface GlitchProps {
  children: React.ReactNode;
}

export const Glitch = ({ children }: GlitchProps) => {
  const isOpen = useRecoilValue(toggleMenuOpen);

  return (
    <div className={`${styles.glitch} ${isOpen && styles.active}`}>
      <div className={styles.glitch__base}>
        <span className={styles.label}>{children}</span>
      </div>
      {[...Array(5)].map((_, index) => (
        <div key={index} className={styles.glitch__layer}>
          <span>{children}</span>
        </div>
      ))}
    </div>
  );
};
