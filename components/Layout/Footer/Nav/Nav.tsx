import Link from 'next/link';
import { useRecoilValue } from 'recoil';

import { GitHubIcon } from '@/components/Common/Icons/GithubIcon/GitHubIcon';
import { XIcon } from '@/components/Common/Icons/XIcon/XIcon';
import { TransitionLink } from '@/components/Common/TransitionLink/TransitionLink';
import styles from '@/components/Layout/Footer/Nav/nav.module.scss';
import { navLinksAtom } from '@/store/navLinks';

export const Nav = () => {
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
                  scroll={false}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <XIcon />
                </Link>
              </div>
            ) : item.title === 'GitHub' ? (
              <div className={styles.nav__item}>
                <Link
                  className={`${styles.nav__link} ${styles.icon}`}
                  href={item.link}
                  scroll={false}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon />
                </Link>
              </div>
            ) : (
              <div className={`${styles.nav__item} _en`}>
                <TransitionLink scroll={false} className={`${styles.nav__link} `} href={item.link}>
                  {item.title}
                </TransitionLink>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
