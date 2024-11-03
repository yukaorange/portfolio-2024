import styles from '@/components/Layout/Footer/footer.module.scss';
import { Nav } from '@/components/Layout/Footer/Nav/Nav';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__inner}>
        <div className={styles.footer__nav}>
          <Nav />
        </div>
        <div className={styles.footer__copyright}>
          <small className={`${styles.footer__copyright__text} _en`}>Designed and built by</small>
          <div className={styles.footer__copyright__icon}>
            <Glass />
          </div>
        </div>
      </div>
    </footer>
  );
};

const Glass = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="11" viewBox="0 0 24 11" fill="none">
      <path
        d="M0 0.681152V5.70441L7.81395 10.1695L11.1628 6.82069H12.8372L16.186 10.1695L24 5.70441V0.681152H0Z"
        fill="#E3E619"
      />
    </svg>
  );
};
