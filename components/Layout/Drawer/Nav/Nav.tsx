import Link from 'next/link';
import { useRecoilValue } from 'recoil';

import { GitHubIcon } from '@/components/Common/Icons/GithubIcon/GitHubIcon';
import { XIcon } from '@/components/Common/Icons/XIcon/XIcon';
import { Glitch } from '@/components/Layout/Drawer/Glitch/Glitch';
import styles from '@/components/Layout/Drawer/Nav/nav.module.scss';
import { navLinksAtom } from '@/store/navLinks';
import { TransitionLink } from '@/components/Common/TransitionLink.tsx/TransitionLink';

interface NavProps {
  onClick: (e: React.MouseEvent | React.KeyboardEvent | React.TouchEvent) => void;
}

export const Nav = ({ onClick }: NavProps) => {
  const links = useRecoilValue(navLinksAtom);

  return (
    <nav className={styles.nav}>
      {links.map((item, key) => {
        return (
          <div key={key} className={styles.nav__item}>
            {item.title === 'X' ? (
              <div className={styles.nav__item}>
                <Link
                  className={`${styles.nav__link} ${styles.icon}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    onClick(e);
                  }}
                >
                  <Glitch>
                    <XIcon fillColor="#151515" />
                  </Glitch>
                </Link>
              </div>
            ) : item.title === 'GitHub' ? (
              <div className={styles.nav__item}>
                <Link
                  className={`${styles.nav__link} ${styles.icon}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    onClick(e);
                  }}
                >
                  <Glitch>
                    <GitHubIcon fillColor="#151515" />
                  </Glitch>
                </Link>
              </div>
            ) : (
              <div className={`${styles.nav__item} _en`}>
                <TransitionLink
                  className={`${styles.nav__link} `}
                  href={item.link}
                  onClose={(e) => {
                    onClick(e);
                  }}
                >
                  <Glitch>{item.title}</Glitch>
                </TransitionLink>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
